import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './api_auth/auth.controller';
import { UserEntityRepository } from './auth.repository';
import { AuthService } from './service_auth/auth.service';
import { UserEntity } from './user.entity';
import { AuthCookieGuard } from './guards/auth-cookie.guard';
import { AuthQueueProducerModule } from './queue_auth/auth.queue.producer.module';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET', 'dev-secret'),
        signOptions: {
          expiresIn: (config.get<string>('JWT_EXPIRES_IN', '7d') ??
            '7d') as any,
        },
      }),
    }),
    TypeOrmModule.forFeature([UserEntity]),
    AuthQueueProducerModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthCookieGuard, UserEntityRepository],
  exports: [AuthService, AuthCookieGuard],
})
export class AuthModule {}
