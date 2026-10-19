/**
 * Vercel Serverless Entry Point
 *
 * Bootstraps the NestJS app once and caches it across warm invocations.
 * Key differences from main.ts:
 *  - No app.listen() — Vercel injects req/res directly
 *  - No compression() — Vercel CDN handles gzip + brotli
 *  - No Swagger — production only
 */

import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import type { NestExpressApplication } from '@nestjs/platform-express'
import cookieParser from 'cookie-parser'
import { json, urlencoded } from 'express'
import type { Request, Response, NextFunction } from 'express'
import helmet from 'helmet'
import { AppModule } from '../src/app.module'

// Cached across warm invocations
let cachedExpressApp: any = null

async function bootstrap(): Promise<any> {
  if (cachedExpressApp) return cachedExpressApp

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
    logger: ['error', 'warn', 'log'],
  })

  const config = app.get(ConfigService)
  const logger = new Logger('ServerlessBootstrap')

  // NOTE: compression() omitted — Vercel CDN handles it.

  app.use(
    json({
      limit: '1mb',
      verify: (req: any, _res, buf) => {
        req.rawBody = buf
      },
    })
  )
  app.use(urlencoded({ extended: true, limit: '1mb' }))

  app.setGlobalPrefix('api/v1')

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', '*.r2.dev', '*.cloudflare.com'],
          connectSrc: ["'self'"],
          fontSrc: ["'self'"],
          frameSrc: ["'none'"],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: [],
        },
      },
      hsts: { maxAge: 31_536_000, includeSubDomains: true, preload: true },
      hidePoweredBy: true,
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
      crossOriginOpenerPolicy: { policy: 'same-origin' },
      crossOriginResourcePolicy: { policy: 'same-site' },
    })
  )

  app.use((_req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
    next()
  })

  app.use(cookieParser())

  // Vercel uses a proxy — trust X-Forwarded-For
  app.set('trust proxy', 1)

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true)

      if (
        /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin) ||
        /\.vercel\.app$/.test(origin) ||
        /pec\.ac\.in$/.test(origin)
      ) {
        return callback(null, true)
      }

      const allowed = config.get<string[]>('CORS_ORIGINS') || []
      if (allowed.includes(origin) || allowed.includes('*')) {
        return callback(null, true)
      }

      return callback(new Error(Origin  not allowed))
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    })
  )

  await app.init()
  logger.log('NestJS app initialized for serverless runtime')

  cachedExpressApp = app.getHttpAdapter().getInstance()
  return cachedExpressApp
}

export default async function handler(req: Request, res: Response): Promise<void> {
  const expressApp = await bootstrap()
  expressApp(req, res)
}
