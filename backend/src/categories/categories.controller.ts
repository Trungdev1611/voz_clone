import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categorie-forum')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get('')
  async findAllCategoryAndForums() {
    return  await this.categoriesService.findAll();
  }

  // @Post('create')
  // createCategory(@Body() createCategoryDto: CreateCategoryDto) {
  //   return this.categoriesService.createCategoryForum(createCategoryDto);
  // }
  
  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    return await this.categoriesService.findOneBySlug(slug);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
