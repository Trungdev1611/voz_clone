import { RedisService } from './../redis/redis.service';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateThreadDto } from './dto/create-thread.dto';
import { UpdateThreadDto } from './dto/update-thread.dto';
import { ThreadRepository } from './thread.repository';
import { ThreadEntity } from './entities/thread.entity';
import { QueryThreadDto } from './dto/query-thread.dto';
import { CategoryForumEntity } from 'src/categories/entities/category.entity';
import type { AuthenticatedUser } from 'src/auth/api_auth/auth.types';
import { Role } from 'src/auth/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ThreadService {
  constructor(
    private readonly threadRepository: ThreadRepository,
    @InjectRepository(CategoryForumEntity)
    private readonly categoryRepo: Repository<CategoryForumEntity>,
    private readonly redisService: RedisService,
  ) {}

  async create(createThreadDto: CreateThreadDto, author: AuthenticatedUser) {
    if (author.role === Role.BANNED) {
      throw new ForbiddenException('Tài khoản của bạn không thể đăng bài.');
    }

    const category = await this.categoryRepo.findOne({
      where: { slug: createThreadDto.categorySlug },
    });
    if (!category) {
      throw new NotFoundException('Không tìm thấy box');
    }

    const slug = createThreadDto.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    return this.threadRepository.createThread({
      title: createThreadDto.title,
      content: createThreadDto.content,
      authorId: author.id,
      categoryId: category.id,
      slug: `${slug || 'thread'}-${Date.now()}`,
      lastPostAt: new Date(),
      lastUserId: author.id,
      repliesCount: 0,
      views: 0,
    });
  }

  async findAllAndPaginate(query: QueryThreadDto): Promise<ThreadEntity[]> {
    const { categorySlug, page = 1, per_page = 20, search } = query;
    let categoryId: number | undefined;
    if (categorySlug) {
      const category = await this.categoryRepo.findOne({
        where: { slug: categorySlug },
      });
      if (!category) {
        throw new NotFoundException('Không tìm thấy box');
      }
      categoryId = category.id;
    }

    return this.threadRepository.findMany({
      where: categoryId ? { categoryId } : {},
      order: { lastPostAt: 'DESC' },
      skip: (page - 1) * per_page,
      take: per_page,
    });
  }

  async findOne(id: number, userId?: number) {
    //check thread exist in redis cache or not before query database

    const threadKey = `thread:${id}`;
    let thread = await this.redisService.get<ThreadEntity>(threadKey);

    if (!thread) {
      thread = await this.threadRepository.findOne({
        where: { id },
        relations: { author: true, category: true },
        select: {
          author: {
            id: true,
            username: true,
          },
          category: {
            id: true,
            name: true,
            slug: true,
          },
        },
      });
      if (thread) {
        //lưu data vào cache
        this.redisService.set(threadKey, thread, 300); // Cache for 5 minutes
      }
    }

    if (!thread) {
      throw new NotFoundException('Không tìm thấy chủ đề');
    }

    //check to increase view count if user is authenticated
    if (userId) {
    //set of userIds in redis
    const userKeys = `thread:${id}:viewedByUsers`;
    const isNewUserWatchThread = await this.redisService.sadd(userKeys, userId); // check userid exist in set users or not
    if (isNewUserWatchThread === 1) {
      //user chưa xem thread này hoặc xem quá 10p từ lần trước
      //tăng view lên 1 trong redis
      const viewKey = `thread:${id}:views`;
      await this.redisService.incre(viewKey, 1);

      const currentTtl = await this.redisService.getTtl(userKeys);
      //nếu key < 0 => chưa có ttl
      if (currentTtl < 0) {
        await this.redisService.expire(userKeys, 600);  //600 seconds = 10 minutes là thời gian hết hạn của key, nó sẽ tự động xoá key sau 10 phút nếu không có activity
        }
      }
    }
    
    return thread;
  }

  update(id: number, updateThreadDto: UpdateThreadDto) {
    return `This action updates a #${id} thread`;
  }

  remove(id: number) {
    return `This action removes a #${id} thread`;
  }
}
