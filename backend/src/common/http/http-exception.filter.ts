import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : undefined;

    let message = 'Internal server error';
    let error: string | undefined;

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (exceptionResponse && typeof exceptionResponse === 'object') {
      const obj = exceptionResponse as Record<string, unknown>;
      const rawMessage = obj.message;
      message = Array.isArray(rawMessage)
        ? rawMessage.join(', ')
        : typeof rawMessage === 'string'
          ? rawMessage
          : message;
      error = typeof obj.error === 'string' ? obj.error : undefined;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const detail = error ? `${message} | ${error}` : message;
    console.log(
      `\x1b[31m[HTTP_ERROR] ${status} ${request.method} ${request.originalUrl} - ${detail}\x1b[0m`,
    );

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      error,
    });
  }
}

