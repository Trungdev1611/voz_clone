import { Module } from '@nestjs/common';
import { ThreadService } from './thread.service';
import { ThreadController } from './thread.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThreadEntity } from './entities/thread.entity';
import { ThreadRepository } from './thread.repository';
import { CategoryForumEntity } from 'src/categories/entities/category.entity';
import { AuthModule } from 'src/auth/auth.module';
import { RedisModule } from 'src/redis/redis.module';
import { ThreadViewsFlushService } from './thread-views-flush.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ThreadEntity, CategoryForumEntity]),
    AuthModule,
    RedisModule,
  ],
  controllers: [ThreadController],
  providers: [ThreadService, ThreadRepository, ThreadViewsFlushService],
})
export class ThreadModule {}
