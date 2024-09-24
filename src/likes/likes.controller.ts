import {
  Controller,
  Post,
  Param,
  UseGuards,
  Req,
  Delete,
  Get,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { find } from 'rxjs';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post('recipe/:recipe')
  @UseGuards(AuthGuard)
  create(@Param('recipe') recipe: string, @Req() request: Request) {
    const payload: Request = request['user'];
    return this.likesService.create(payload, +recipe);
  }

  @Delete('recipe/:recipe')
  @UseGuards(AuthGuard)
  delete(@Param('recipe') recipe: string, @Req() request: Request) {
    const payload: Request = request['user'];
    return this.likesService.delete(payload, +recipe);
  }

  @Get('recipe/:recipe')
  @UseGuards(AuthGuard)
  findOne(@Param('recipe') recipe: string, @Req() request: Request) {
    const payload: Request = request['user'];
    return this.likesService.findOne(payload, +recipe);
  }
}
