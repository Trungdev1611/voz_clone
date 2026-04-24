import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  buildTypeOrmOptions,
  migrationsGlobCompiled,
  readDbCredentials,
} from './database/typeorm.shared';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { CategoriesModule } from './categories/categories.module';
import { ThreadModule } from './thread/thread.module';
import { BullModule } from '@nestjs/bullmq';

import { RedisModule } from './redis/redis.module';
import { QueueModule } from './queue/queue.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    //cấu hình nếu cần cron job
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60000,
        limit: 100,
      },
    ]),
    //add queue module was configured in queue.module
    QueueModule,

    //cấu hình database
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...buildTypeOrmOptions(
          readDbCredentials(),
          migrationsGlobCompiled(__dirname),
        ),
        migrationsRun: false,
      }),
    }),

  
    AuthModule,
    HealthModule,
    CategoriesModule,
    ThreadModule,
    RedisModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
