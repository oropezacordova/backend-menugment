import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './categories/entities/category.entity';

@Injectable()
export class AppService implements OnModuleInit {
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
}
