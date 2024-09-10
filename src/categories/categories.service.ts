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
    return categories;
  }

  async findOne(id: number) {
    try {
      const category = await this.categoriesRepository.findOne({
        where: { id },
      });
      return category;
    } catch (error) {
      if (!(await this.categoriesRepository.existsBy({ id }))) {
        throw new NotFoundException(`Category with id ${id} not found`);
      }
    }
  }
}
