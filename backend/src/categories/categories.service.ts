import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryForumRepository } from './categories.repository';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoryForumRepository: CategoryForumRepository) {}

  create(createCategoryDto: CreateCategoryDto) {
    return 'This action adds a new category';
  }

  async findAll() {
    //get all categories and forums nested
    return this.categoryForumRepository.getAllCategoriesAndForums();  
  }


  async findOneBySlug(slug: string) {
    const category = await this.categoryForumRepository.findOneBySlug(slug);
    if (!category) {
      throw new NotFoundException('Không tìm thấy box');
    }
    return category;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
