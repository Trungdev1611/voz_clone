import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from '../service_auth/auth.service';
import { readVozAccessTokenFromCookie } from '../read-voz-access-token';
import type { AuthenticatedUser } from '../api_auth/auth.types';

@Injectable()
export class AuthCookieGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    let token: string;
    try {
      token = readVozAccessTokenFromCookie(request);
    } catch {
      throw new UnauthorizedException('Bạn chưa đăng nhập');
    }

    const result = await this.authService.getMeFromAccessToken(token);
    (request as Request & { user: AuthenticatedUser }).user = result.user;
    return true;
  }
}
