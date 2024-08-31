import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async findAll() {
    const categories = await this.categoriesRepository.find();
    for (const category of categories) {
      for (const recipe of category.recipes) {
        if (recipe.user) {
          delete recipe.user.password;
        }
      }
    }
    return categories;
  }

  async findOne(id: number) {
    if (!(await this.categoriesRepository.existsBy({ id }))) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    const category = await this.categoriesRepository.findOne({ where: { id } });
    for (const recipe of category.recipes) {
      delete recipe.user.password;
    }
    return category;
  }
}
