import { Module } from '@nestjs/common';
import { ThreadService } from './thread.service';
import { ThreadController } from './thread.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThreadEntity } from './entities/thread.entity';
import { ThreadRepository } from './thread.repository';
import { CategoryForumEntity } from 'src/categories/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ThreadEntity, CategoryForumEntity])],
  controllers: [ThreadController],
  providers: [ThreadService, ThreadRepository],
})
export class ThreadModule {}
