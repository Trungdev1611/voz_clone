import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { CategoryForumRepository } from './categories.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryForumEntity } from './entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryForumEntity])],
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoryForumRepository],
})
export class CategoriesModule {}
