import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { CategoryForumEntity } from './entities/category.entity';

@Injectable()
export class CategoryForumRepository {
  constructor(
    @InjectRepository(  CategoryForumEntity)
    private readonly repository: Repository<CategoryForumEntity>,
  ) {}

  // 1. findAll categories and forums
  async getAllCategoriesAndForums(): Promise<CategoryForumEntity[]> {
    return this.repository.find({ relations: ['forums'] , where: { category_id: IsNull() } });
  }

  async findOneBySlug(slug: string): Promise<CategoryForumEntity | null> {
    return this.repository.findOne({ where: { slug } });
  }


}