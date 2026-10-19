import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { Request, Response } from 'express'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name)

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

    const message =
      exception instanceof HttpException ? exception.getResponse() : 'Internal Server Error'

    // Log the error internally
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `[${request.method}] ${request.url} - ${
          exception instanceof Error ? exception.stack : 'Unknown error'
        }`
      )
    } else {
      this.logger.warn(
        `[${request.method}] ${request.url} - Status: ${status} - Error: ${
          typeof message === 'object' ? JSON.stringify(message) : message
        }`
      )
    }

    // Send a sanitized, standardized response to the client
    const errorBody =
      typeof message === 'object' && message !== null
        ? (message as Record<string, unknown>)
        : {}

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      ...errorBody,
      message: typeof message === 'string' ? message : (message as any).message || message,
    })
  }
}
