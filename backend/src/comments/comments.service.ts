import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/auth/user.entity';
import type { AuthenticatedUser } from 'src/auth/api_auth/auth.types';
import { ThreadEntity } from 'src/thread/entities/thread.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { QueryCommentDto } from './dto/query-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentEntity } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  private readonly commentEditWindowMinutes: number;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(CommentEntity)
    private readonly commentRepo: Repository<CommentEntity>,
    @InjectRepository(ThreadEntity)
    private readonly threadRepo: Repository<ThreadEntity>,
  ) {
    this.commentEditWindowMinutes = Number(
      this.configService.get<string>('COMMENT_EDIT_WINDOW_MINUTES') ?? 15,
    );
  }

  async create(createCommentDto: CreateCommentDto, user: AuthenticatedUser) {
    const thread = await this.threadRepo.findOne({
      where: { id: createCommentDto.threadId },
    });
    if (!thread) {
      throw new NotFoundException('Không tìm thấy chủ đề');
    }

    const comment = this.commentRepo.create({
      threadId: createCommentDto.threadId,
      userId: user.id,
      content: createCommentDto.content.trim(),
    });
    const created = await this.commentRepo.save(comment);

    await this.threadRepo.update(
      { id: thread.id },
      {
        repliesCount: (thread.repliesCount ?? 0) + 1,
        lastPostAt: new Date(),
        lastUserId: user.id,
      },
    );

    return this.findOne(created.id, user);
  }

  async findAllByThread(
    query: QueryCommentDto,
    me?: AuthenticatedUser,
  ) {
    const threadId = query.threadId;
    const page = query.page ?? 1;
    const per_page = query.per_page ?? 20;

    const [items, total] = await this.commentRepo.findAndCount({
      where: { threadId },
      relations: { user: true },
      select: {
        id: true,
        content: true,
        threadId: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        user: {
          id: true,
          username: true,
        },
      },
      order: { createdAt: 'ASC' },
      skip: (page - 1) * per_page,
      take: per_page,
    });

    return {
      items: items.map((item) => this.toCommentView(item, me)),
      page,
      per_page,
      total,
      total_pages: Math.max(1, Math.ceil(total / per_page)),
    };
  }

  async findOne(id: number, me?: AuthenticatedUser) {
    const comment = await this.commentRepo.findOne({
      where: { id },
      relations: { user: true },
      select: {
        id: true,
        content: true,
        threadId: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        user: {
          id: true,
          username: true,
        },
      },
    });
    if (!comment) {
      throw new NotFoundException('Không tìm thấy bình luận');
    }
    return this.toCommentView(comment, me);
  }

  async update(
    id: number,
    updateCommentDto: UpdateCommentDto,
    user: AuthenticatedUser,
  ) {
    const existing = await this.commentRepo.findOne({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Không tìm thấy bình luận');
    }
    const isOwner = existing.userId === user.id;
    const isStaff = user.role === Role.ADMIN || user.role === Role.MOD;
    if (!isOwner && !isStaff) {
      throw new ForbiddenException('Bạn không có quyền sửa bình luận này');
    }
    if (!isStaff && !this.isWithinEditWindow(existing.createdAt)) {
      throw new ForbiddenException('Đã quá thời gian chỉnh sửa bình luận');
    }

    await this.commentRepo.update(
      { id },
      {
        content: updateCommentDto.content?.trim() ?? existing.content,
      },
    );
    return this.findOne(id, user);
  }

  async remove(id: number, user: AuthenticatedUser) {
    const existing = await this.commentRepo.findOne({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Không tìm thấy bình luận');
    }
    const isOwner = existing.userId === user.id;
    const isStaff = user.role === Role.ADMIN || user.role === Role.MOD;
    if (!isOwner && !isStaff) {
      throw new ForbiddenException('Bạn không có quyền xóa bình luận này');
    }
    if (!isStaff && !this.isWithinEditWindow(existing.createdAt)) {
      throw new ForbiddenException('Đã quá thời gian xóa bình luận');
    }

    await this.commentRepo.delete({ id });

    await this.threadRepo
      .createQueryBuilder()
      .update(ThreadEntity)
      .set({
        repliesCount: () => 'GREATEST(replies_count - 1, 0)',
      })
      .where('id = :id', { id: existing.threadId })
      .execute();

    return { id, deleted: true };
  }

  private isWithinEditWindow(createdAt: Date): boolean {
    const windowMs = this.commentEditWindowMinutes * 60 * 1000;
    return Date.now() - createdAt.getTime() <= windowMs;
  }

  private toCommentView(comment: CommentEntity, me?: AuthenticatedUser) {
    const isStaff = me?.role === Role.ADMIN || me?.role === Role.MOD;
    const isOwner = Boolean(me?.id && me.id === comment.userId);
    const withinEditWindow = this.isWithinEditWindow(comment.createdAt);
    const canEdit = Boolean(me?.id) && (isStaff || (isOwner && withinEditWindow));
    const canDelete = canEdit;
    const editExpiresAt = new Date(
      comment.createdAt.getTime() + this.commentEditWindowMinutes * 60 * 1000,
    ).toISOString();

    return {
      ...comment,
      canEdit,
      canDelete,
      editExpiresAt,
    };
  }
}
