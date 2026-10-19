import {
  CallHandler,
  ConflictException,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common'
import { from, Observable, of } from 'rxjs'
import { switchMap, tap } from 'rxjs/operators'
import type { Request, Response } from 'express'
import { CacheService } from '../cache/cache.service'

interface IdempotencyEntry {
  status: 'IN_FLIGHT' | 'COMPLETED'
  response?: unknown
  statusCode?: number
}

const IDEMPOTENCY_TTL_SEC = 24 * 60 * 60 // 24 hours

/**
 * IdempotencyInterceptor — persisted via CacheService (Upstash Redis on Vercel,
 * in-memory fallback for local dev).
 *
 * On a request carrying an Idempotency-Key / X-Idempotency-Key header:
 *   • MISS  → mark IN_FLIGHT, process normally, store COMPLETED response.
 *   • HIT COMPLETED → replay stored response, skip handler.
 *   • HIT IN_FLIGHT → 409 Conflict (concurrent duplicate).
 *
 * Because CacheService.get() is now async, the intercept uses from(Promise)
 * + switchMap to stay within RxJS without blocking the event loop.
 */
@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  private readonly logger = new Logger(IdempotencyInterceptor.name)

  constructor(private readonly cacheService: CacheService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp()
    const req = http.getRequest<Request>()
    const res = http.getResponse<Response>()

    const rawKey = req.headers['idempotency-key'] || req.headers['x-idempotency-key']
    if (!rawKey || typeof rawKey !== 'string') {
      return next.handle()
    }

    const userId = (req as any).user?.id || req.ip || 'anon'
    const cacheKey = `idem:${req.method}:${req.path}:${userId}:${rawKey.trim()}`

    // Bridge async cache lookup into Observable
    return from(this.resolve(cacheKey, req, res, next)).pipe(switchMap((obs) => obs))
  }

  private async resolve(
    cacheKey: string,
    req: Request,
    res: Response,
    next: CallHandler
  ): Promise<Observable<any>> {
    const existing = await this.cacheService.get<IdempotencyEntry>(cacheKey)

    if (existing) {
      if (existing.status === 'IN_FLIGHT') {
        throw new ConflictException(
          'A request with this Idempotency-Key is currently being processed. Please retry shortly.'
        )
      }

      if (existing.status === 'COMPLETED' && existing.response !== undefined) {
        this.logger.log(`Idempotency cache HIT for key: ${cacheKey}`)
        res.setHeader('x-cache-idempotent', 'HIT')
        if (existing.statusCode) res.status(existing.statusCode)
        return of(existing.response)
      }
    }

    // Mark as IN_FLIGHT before handing off to the handler
    await this.cacheService.set<IdempotencyEntry>(
      cacheKey,
      { status: 'IN_FLIGHT' },
      IDEMPOTENCY_TTL_SEC
    )
    res.setHeader('x-cache-idempotent', 'MISS')

    return next.handle().pipe(
      tap({
        next: (data) => {
          // Fire-and-forget: mark COMPLETED. Await not needed — TTL covers cleanup.
          this.cacheService
            .set<IdempotencyEntry>(
              cacheKey,
              { status: 'COMPLETED', response: data, statusCode: res.statusCode },
              IDEMPOTENCY_TTL_SEC
            )
            .catch((err: Error) =>
              this.logger.error(`Failed to persist idempotency COMPLETED state: ${err.message}`)
            )
        },
        error: () => {
          // On handler error: remove the IN_FLIGHT key so the client can retry.
          this.cacheService
            .invalidate(cacheKey)
            .catch((err: Error) =>
              this.logger.error(`Failed to clear IN_FLIGHT idempotency key: ${err.message}`)
            )
        },
      })
    )
  }
}

