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

  async create(createRecipeDto: CreateRecipeDto, payload: Request) {
    const user = await this.usersService.findOne(payload['user_id']);
    const category = await this.categoriesService.findOne(
      createRecipeDto.category,
    );
    const recipe = await this.recipesRepository.save({
      ...createRecipeDto,
      user,
      category,
    });
    delete recipe.user.password;
    return recipe;
  }

  async upload(id: number, files: Express.Multer.File[]) {
    const photos = (await this.findOne(id)).files;
    for (const file of files) {
      photos.push(file.path);
    }
    this.recipesRepository.update(id, {
      files: photos,
    });
    return await this.findOne(id);
  }

  async findAll() {
    const recipes = await this.recipesRepository.find({
      relations: { category: true, user: true },
    });
    recipes.forEach((recipe) => {
      delete recipe.user.password;
    });
    return recipes;
  }

  async findOne(id: number) {
    try {
      const recipe = await this.recipesRepository.findOne({
        where: { id },
        relations: { category: true, user: true },
      });
      delete recipe.user.password;
      return recipe;
    } catch (error) {
      if (!(await this.recipesRepository.existsBy({ id }))) {
        throw new NotFoundException(`Recipe with id ${id} not found`);
      }
    }
  }

  async update(id: number, updateRecipeDto: UpdateRecipeDto) {
    const category = await this.categoriesService.findOne(
      updateRecipeDto.category,
    );
    const { deletedImages, ...restOfUpdateDto } = updateRecipeDto;
    this.recipesRepository.update(id, {
      ...restOfUpdateDto,
      category,
    });
    return this.findOne(id);
  }

  remove(id: number) {
    this.findOne(id);
    return this.recipesRepository.delete(id);
  }
}
