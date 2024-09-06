import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './categories/entities/category.entity';
import { User } from './users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
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
    const user = {
      username: 'anonymous',
      password: 'password',
      email: 'anonymous@gmail.com',
    };
    const userExist = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email: user.email })
      .orWhere('user.username = :username', { username: user.email })
      .getOne();
    if (!userExist) {
      await this.usersRepository.save(user);
    }
    const passwordHash = await bcrypt.hash(user.password, 10);
    await this.usersRepository.update(1, { password: passwordHash });
  }
}
