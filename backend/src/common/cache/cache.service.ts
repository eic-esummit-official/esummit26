import { Injectable, Logger, OnModuleDestroy, Optional } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Redis } from '@upstash/redis'

interface MemCacheEntry<T> {
  value: T
  expiresAt: number
  tags: string[]
}

/**
 * CacheService — serverless-safe, dual-mode cache.
 *
 * • When UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN are set (production /
 *   Vercel) it uses Upstash Redis via HTTP — stateless, works across cold starts.
 * • When those vars are absent (local dev) it transparently falls back to an
 *   in-memory Map. No changes required in callers.
 *
 * All mutation methods (set / invalidate*) are async-safe but callers may fire-
 * and-forget them (no need to await in invalidation paths).
 */
@Injectable()
export class CacheService implements OnModuleDestroy {
  private readonly logger = new Logger(CacheService.name)

  // ── Upstash Redis (serverless mode) ──────────────────────────────────────
  private readonly redis: Redis | null = null

  // ── In-memory fallback (local dev) ───────────────────────────────────────
  private readonly store = new Map<string, MemCacheEntry<unknown>>()
  private readonly tagIndex = new Map<string, Set<string>>()
  private readonly gcInterval: NodeJS.Timeout | null = null

  constructor(@Optional() private readonly config?: ConfigService) {
    const url = this.config?.get<string>('UPSTASH_REDIS_REST_URL')
    const token = this.config?.get<string>('UPSTASH_REDIS_REST_TOKEN')

    if (url && token) {
      this.redis = new Redis({ url, token })
      this.logger.log('CacheService: Upstash Redis (serverless-safe HTTP transport)')
    } else {
      this.logger.warn(
        'CacheService: UPSTASH_REDIS_REST_URL not configured — using in-memory cache ' +
          '(fine for local dev, not suitable for serverless deployments)'
      )
      // GC sweep only required for the in-memory path
      this.gcInterval = setInterval(() => this.purgeExpiredLocal(), 60_000)
    }
  }

  onModuleDestroy() {
    if (this.gcInterval) clearInterval(this.gcInterval)
  }

  // ── Public API ─────────────────────────────────────────────────────────────

  /** Retrieve a cached value; returns null on miss or expiry. */
  async get<T>(key: string): Promise<T | null> {
    if (this.redis) {
      try {
        const val = await this.redis.get<T>(key)
        return val ?? null
      } catch (err) {
        this.logger.error(`Redis GET "${key}": ${err}`)
        return null
      }
    }
    return this.getLocal<T>(key)
  }

  /** Store a value with a TTL and optional tag groups. */
  async set<T>(key: string, value: T, ttlSeconds = 300, tags: string[] = []): Promise<void> {
    if (this.redis) {
      try {
        await this.redis.set(key, value, { ex: ttlSeconds })
        // Store tag membership so invalidateTag can work
        for (const tag of tags) {
          await this.redis.sadd(`__tag__:${tag}`, key)
          await this.redis.expire(`__tag__:${tag}`, ttlSeconds + 60)
        }
      } catch (err) {
        this.logger.error(`Redis SET "${key}": ${err}`)
      }
      return
    }
    this.setLocal(key, value, ttlSeconds, tags)
  }

  /**
   * Cache-aside / getOrSet pattern.
   * Returns the cached value if fresh, otherwise calls factory(), caches, and returns.
   */
  async getOrSet<T>(
    key: string,
    ttlSeconds: number,
    factory: () => Promise<T>,
    tags: string[] = []
  ): Promise<T> {
    const cached = await this.get<T>(key)
    if (cached !== null) return cached

    const fresh = await factory()
    await this.set(key, fresh, ttlSeconds, tags)
    return fresh
  }

  /** Delete a single key. */
  async invalidate(key: string): Promise<void> {
    if (this.redis) {
      try {
        await this.redis.del(key)
      } catch (err) {
        this.logger.error(`Redis DEL "${key}": ${err}`)
      }
      return
    }
    this.invalidateLocal(key)
  }

  /** Delete all keys whose name starts with prefix (e.g. "cms:events"). */
  async invalidatePrefix(prefix: string): Promise<void> {
    if (this.redis) {
      try {
        const keys = await this.redis.keys(`${prefix}*`)
        if (keys.length > 0) {
          await this.redis.del(...(keys as [string, ...string[]]))
          this.logger.debug(`Redis: purged ${keys.length} keys with prefix "${prefix}"`)
        }
      } catch (err) {
        this.logger.error(`Redis prefix invalidation "${prefix}": ${err}`)
      }
      return
    }
    let count = 0
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) {
        this.invalidateLocal(key)
        count++
      }
    }
    if (count > 0) this.logger.debug(`Purged ${count} in-memory keys with prefix "${prefix}"`)
  }

  /** Delete all keys that share a tag (e.g. "cms"). */
  async invalidateTag(tag: string): Promise<void> {
    if (this.redis) {
      try {
        const tagKey = `__tag__:${tag}`
        const keys = await this.redis.smembers(tagKey)
        if (keys.length > 0) {
          await this.redis.del(...(keys as [string, ...string[]]))
          await this.redis.del(tagKey)
          this.logger.debug(`Redis: purged cache tag "${tag}"`)
        }
      } catch (err) {
        this.logger.error(`Redis tag invalidation "${tag}": ${err}`)
      }
      return
    }
    const keys = this.tagIndex.get(tag)
    if (keys) {
      for (const key of Array.from(keys)) this.store.delete(key)
      this.tagIndex.delete(tag)
      this.logger.debug(`Purged in-memory cache tag "${tag}"`)
    }
  }

  /** Flush the entire cache (use with caution). */
  async flush(): Promise<void> {
    if (this.redis) {
      try {
        await this.redis.flushdb()
        this.logger.log('Upstash Redis: cache flushed.')
      } catch (err) {
        this.logger.error(`Redis FLUSHDB: ${err}`)
      }
      return
    }
    this.store.clear()
    this.tagIndex.clear()
    this.logger.log('In-memory cache flushed.')
  }

  // ── In-memory helpers ─────────────────────────────────────────────────────

  private getLocal<T>(key: string): T | null {
    const entry = this.store.get(key)
    if (!entry) return null
    if (Date.now() > entry.expiresAt) {
      this.invalidateLocal(key)
      return null
    }
    return entry.value as T
  }

  private setLocal<T>(key: string, value: T, ttlSeconds: number, tags: string[]): void {
    const expiresAt = Date.now() + ttlSeconds * 1_000
    this.store.set(key, { value, expiresAt, tags })
    for (const tag of tags) {
      if (!this.tagIndex.has(tag)) this.tagIndex.set(tag, new Set())
      this.tagIndex.get(tag)!.add(key)
    }
  }

  private invalidateLocal(key: string): void {
    const entry = this.store.get(key)
    if (entry) {
      for (const tag of entry.tags) this.tagIndex.get(tag)?.delete(key)
      this.store.delete(key)
    }
  }

  private purgeExpiredLocal(): void {
    const now = Date.now()
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.expiresAt) this.invalidateLocal(key)
    }
  }
}
