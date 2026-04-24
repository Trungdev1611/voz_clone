import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  buildTypeOrmOptions,
  migrationsGlobCompiled,
  readDbCredentials,
} from './database/typeorm.shared';
import { QueueModule } from './queue/queue.module';
import { AuthQueueWorkerModule } from './auth/queue_auth/auth.queue.worker.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...buildTypeOrmOptions(
          readDbCredentials(),
          migrationsGlobCompiled(__dirname),
        ),
        migrationsRun: false,
      }),
    }),
    QueueModule,
    AuthQueueWorkerModule,
  ],
})
export class WorkerModule {}
