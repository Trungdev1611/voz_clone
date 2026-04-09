import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateThreadDto } from './dto/create-thread.dto';
import { UpdateThreadDto } from './dto/update-thread.dto';
import { ThreadRepository } from './thread.repository';
import { ThreadEntity } from './entities/thread.entity';
import { QueryThreadDto } from './dto/query-thread.dto';
import { CategoryForumEntity } from 'src/categories/entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ThreadService {
  constructor(
    private readonly threadRepository: ThreadRepository,
    @InjectRepository(CategoryForumEntity)
    private readonly categoryRepo: Repository<CategoryForumEntity>,
  ) {}

  async create(createThreadDto: CreateThreadDto) {
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
      authorId: createThreadDto.authorId,
      categoryId: category.id,
      slug: `${slug || 'thread'}-${Date.now()}`,
      lastPostAt: new Date(),
      lastUserId: createThreadDto.authorId,
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

  async findOne(id: number) {
    const thread = await this.threadRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!thread) {
      throw new NotFoundException('Không tìm thấy chủ đề');
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
