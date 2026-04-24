import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from '../service_auth/auth.service';
import { CreateUserDto, LoginDto, ResendVerificationDto } from './dto/user.dto';
import { readVozAccessTokenFromCookie } from '../read-voz-access-token';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private readAccessTokenFromCookie(request: Request): string {
    try {
      return readVozAccessTokenFromCookie(request);
    } catch {
      throw new UnauthorizedException('Bạn chưa đăng nhập');
    }
  }

  @Post('register')
  async register(@Body() userdto: CreateUserDto) {
    return this.authService.register(userdto);
  }

  @Post('resend-verification')
  async resendVerification(@Body() body: ResendVerificationDto) {
    return this.authService.resendVerificationEmail(body.email);
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login(loginDto);
    response.cookie('voz_access_token', result.accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    return {
      message: result.message,
      user: result.user,
    };
  }

  @Get('me')
  async me(@Req() request: Request) {
    const accessToken = this.readAccessTokenFromCookie(request);
    return this.authService.getMeFromAccessToken(accessToken);
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('voz_access_token', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    return { message: 'Đăng xuất thành công' };
  }
}