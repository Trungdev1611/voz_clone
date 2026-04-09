import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions, FindManyOptions } from 'typeorm';
import { ThreadEntity } from './entities/thread.entity';

@Injectable()
export class ThreadRepository {
  constructor(
    @InjectRepository(ThreadEntity)
    private readonly repository: Repository<ThreadEntity>,
  ) {}

  // 1. finOneoption
  async findOne(options: FindOneOptions<ThreadEntity>): Promise<ThreadEntity | null> {
    return this.repository.findOne(options);
  }

  // 2. Find ID with Error Handling
  async findById(id: any): Promise<ThreadEntity> {
    const record = await this.repository.findOne({ where: { id } as any });
    if (!record) throw new NotFoundException(`Thread not found`);
    return record;
  }

  // 3. create function
  async createThread(data: Partial<ThreadEntity>): Promise<ThreadEntity> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  // 4. Update function
  async updateThread(id: any, data: Partial<ThreadEntity>): Promise<ThreadEntity> {
    await this.repository.update(id, data as any);
    return this.findById(id);
  }

  // 5. Custom Query 
  async findActiveUsers(): Promise<ThreadEntity[]> {
    return this.repository.find({ where: { isActive: true } as any });
  }

  async findMany(options: FindManyOptions<ThreadEntity>): Promise<ThreadEntity[]> {
    return this.repository.find(options);
  }
}