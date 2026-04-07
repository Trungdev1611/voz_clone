import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { UserEntityRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { UserEntity } from './user.entity';

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
  ],
  controllers: [AuthController],
  providers: [AuthService, UserEntityRepository],
})
export class AuthModule {}
