import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

type WrappedSuccess<T> = {
  success: true;
  message: string;
  data: T;
};

@Injectable()
export class SuccessResponseInterceptor<T>
  implements NestInterceptor<T, WrappedSuccess<unknown>>
{
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<WrappedSuccess<unknown>> {
    return next.handle().pipe(
      map((payload: unknown) => {
        if (
          payload &&
          typeof payload === 'object' &&
          'success' in (payload as Record<string, unknown>)
        ) {
          return payload as WrappedSuccess<unknown>;
        }

        if (
          payload &&
          typeof payload === 'object' &&
          'message' in (payload as Record<string, unknown>)
        ) {
          const obj = payload as Record<string, unknown>;
          const message =
            typeof obj.message === 'string' ? obj.message : 'OK';
          const { message: _, ...rest } = obj;
          return {
            success: true,
            message,
            data: rest,
          };
        }

        return {
          success: true,
          message: 'OK',
          data: payload,
        };
      }),
    );
  }
}

