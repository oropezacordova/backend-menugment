import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService implements OnModuleInit {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async onModuleInit() {
    const categories = [
      { name: 'Pizza' },
      { name: 'Pasta' },
      { name: 'Sushi' },
      { name: 'Burger' },
      { name: 'Salad' },
    ];
    for (const category of categories) {
      if (
        !(await this.categoriesRepository.existsBy({ name: category.name }))
      ) {
        await this.categoriesRepository.save(category);
      }
    }
  }

  findAll() {
    return this.categoriesRepository.find({ relations: { recipes: true } });
  }

  async findOne(id: number) {
    if (!(await this.categoriesRepository.existsBy({ id }))) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    return this.categoriesRepository.findOne({
      where: { id },
      relations: { recipes: true },
    });
  }
}
