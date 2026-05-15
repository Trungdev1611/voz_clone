import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { CommentEntity } from './entities/comment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThreadEntity } from 'src/thread/entities/thread.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([CommentEntity, ThreadEntity]), AuthModule],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
