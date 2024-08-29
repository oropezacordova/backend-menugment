import { Injectable } from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
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

  async create(createLikeDto: CreateLikeDto) {
    const user = await this.usersService.findOne(createLikeDto.user);
    const recipe = await this.recipesService.findOne(createLikeDto.recipe);
    return this.likesRepository.save({
      ...createLikeDto,
      user,
      recipe,
    });
  }

  async remove(id: number) {
    if (!(await this.likesRepository.existsBy({ id }))) {
      throw new Error(`Like with id ${id} not found`);
    }
    return this.likesRepository.delete(id);
  }
}
