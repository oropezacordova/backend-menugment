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

  async create(
    createRecipeDto: CreateRecipeDto,
    payload: Request,
    files: Array<Express.Multer.File>,
  ) {
    const photos = [];
    for (const file of files) {
      photos.push(file.path);
    }
    const user = await this.usersService.findOne(payload['user_id']);
    const category = await this.categoriesService.findOne(
      createRecipeDto.category,
    );
    const recipe = await this.recipesRepository.save({
      ...createRecipeDto,
      user,
      category,
      files: photos,
    });
    delete recipe.user;
    delete recipe.category;
    return recipe;
  }

  async findAll() {
    const recipes = await this.recipesRepository.find({
      relations: { user: true, comments: true, likes: true, category: true },
    });
    for (const recipe of recipes) {
      delete recipe.user.password;
    }
    return recipes;
  }

  async findOne(id: number) {
    if (!(await this.recipesRepository.existsBy({ id }))) {
      throw new NotFoundException(`Recipe with id ${id} not found`);
    }
    const recipe = await this.recipesRepository.findOne({
      where: { id },
      relations: { user: true, category: true, comments: true, likes: true },
    });
    delete recipe.user.password;
    return recipe;
  }

  async update(
    id: number,
    updateRecipeDto: UpdateRecipeDto,
    files: Array<Express.Multer.File>,
  ) {
    this.findOne(id);
    const photos = [];
    for (const file of files) {
      photos.push(file.path);
    }
    const category = await this.categoriesService.findOne(
      updateRecipeDto.category,
    );
    return this.recipesRepository.update(id, {
      ...updateRecipeDto,
      category,
      files: photos,
    });
  }

  remove(id: number) {
    this.findOne(id);
    return this.recipesRepository.delete(id);
  }
}
