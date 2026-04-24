// implement queue.module and connect redis
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { QUEUE_NAME } from './queue.constant';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';


@Module({
  imports: [BullModule.forRootAsync(
    {
    useFactory: async (config: ConfigService) => ({
      connection: {
        host: config.get<string>('REDIS_HOST') ?? 'localhost',
        port: Number(config.get<number>('REDIS_PORT')) || 6379,
      },
    }),
    inject: [ConfigService],
  }),

  //setup dashboard for queue - start
  BullBoardModule.forRoot({
    route: '/admin/queues', // Đường dẫn để bạn vào check ở dashboard
    adapter: ExpressAdapter,
  }),

  BullBoardModule.forFeature({
    name: QUEUE_NAME.AUTH, // Tên queue bạn muốn quản lý
    adapter: BullMQAdapter, // Hoặc BullMQAdapter nếu dùng BullMQ
  }),


  //setup dashboard for queue - end
],
  providers: [],
  exports: [BullModule],
})
export class QueueModule {}