import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Recipe } from './entities/recipe.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { CategoriesService } from 'src/categories/categories.service';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private recipesRepository: Repository<Recipe>,
    private readonly usersService: UsersService,
    private readonly categoriesService: CategoriesService,
  ) {}

  async create(createRecipeDto: CreateRecipeDto) {
    const user = await this.usersService.findOne(createRecipeDto.user);
    const category = await this.categoriesService.findOne(
      createRecipeDto.category,
    );
    return this.recipesRepository.save({
      ...createRecipeDto,
      user,
      category,
    });
  }

  findAll() {
    return this.recipesRepository.find();
  }

  async findOne(id: number) {
    if (!(await this.recipesRepository.existsBy({ id }))) {
      throw new NotFoundException(`Recipe with id ${id} not found`);
    }
    const recipe = await this.recipesRepository.findOne({
      where: { id },
      relations: { user: true, category: true },
    });
    if (recipe && recipe.user) {
      delete recipe.user.password;
    }
    return recipe;
  }

  async update(id: number, updateRecipeDto: UpdateRecipeDto) {
    this.findOne(id);
    const user = await this.usersService.findOne(updateRecipeDto.user);
    const category = await this.categoriesService.findOne(
      updateRecipeDto.category,
    );
    return this.recipesRepository.update(id, {
      ...updateRecipeDto,
      user,
      category,
    });
  }

  remove(id: number) {
    this.findOne(id);
    return this.recipesRepository.delete(id);
  }
}
