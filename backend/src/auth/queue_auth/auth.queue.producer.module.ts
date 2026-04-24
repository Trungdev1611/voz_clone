import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { QUEUE_NAME } from 'src/queue/queue.constant';
import { defaultQueueOptions } from 'src/queue/queue.options';
import { AuthProducer } from './auth.producer';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QUEUE_NAME.AUTH,
      defaultJobOptions: defaultQueueOptions,
    }),
  ],
  providers: [AuthProducer],
  exports: [AuthProducer],
})
export class AuthQueueProducerModule {}
