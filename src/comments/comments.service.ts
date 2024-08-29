import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { RecipesService } from 'src/recipes/recipes.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    private readonly usersService: UsersService,
    private readonly recipesService: RecipesService,
  ) {}

  async create(createCommentDto: CreateCommentDto) {
    const user = await this.usersService.findOne(createCommentDto.user);
    const recipe = await this.recipesService.findOne(createCommentDto.recipe);
    return this.commentsRepository.save({
      ...createCommentDto,
      user,
      recipe,
    });
  }

  async findOne(id: number) {
    if (!(await this.commentsRepository.existsBy({ id }))) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    this.findOne(id);
    const user = await this.usersService.findOne(updateCommentDto.user);
    const recipe = await this.recipesService.findOne(updateCommentDto.recipe);
    return this.commentsRepository.update(id, {
      ...updateCommentDto,
      user,
      recipe,
    });
  }

  remove(id: number) {
    this.findOne(id);
    return this.commentsRepository.delete(id);
  }
}
