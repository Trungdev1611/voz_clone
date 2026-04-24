import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from 'src/mail/mail.module';
import { QUEUE_NAME } from 'src/queue/queue.constant';
import { defaultQueueOptions } from 'src/queue/queue.options';
import { UserEntityRepository } from '../auth.repository';
import { UserEntity } from '../user.entity';
import { AuthCleanupService } from '../service_auth/auth.cleanup.service';
import { AuthWorker } from './auth.worker';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QUEUE_NAME.AUTH,
      defaultJobOptions: defaultQueueOptions,
    }),
    TypeOrmModule.forFeature([UserEntity]),
    MailModule,
  ],
  providers: [AuthWorker, AuthCleanupService, UserEntityRepository],
})
export class AuthQueueWorkerModule {}
