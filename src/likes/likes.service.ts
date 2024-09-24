import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { RecipesService } from 'src/recipes/recipes.service';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private likesRepository: Repository<Like>,
    private readonly usersService: UsersService,
    private readonly recipesService: RecipesService,
  ) {}

  async create(payload: Request, recipeId: number) {
    const user = await this.usersService.findOne(payload['userId']);
    const recipe = await this.recipesService.findOne(recipeId);
    return this.likesRepository.save({
      user,
      recipe,
    });
  }

  async delete(payload: Request, recipeId: number) {
    const like = await this.findOne(payload, recipeId);
    if (like) {
      return this.likesRepository.delete(like.id);
    }
  }

  async findOne(payload: Request, recipeId: number) {
    const like = await this.likesRepository.findOne({
      where: { recipe: { id: recipeId }, user: { id: payload['userId'] } },
    });
    return like;
  }
}
