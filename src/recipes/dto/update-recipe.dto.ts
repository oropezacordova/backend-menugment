import { PartialType } from '@nestjs/mapped-types';
import { CreateRecipeDto } from './create-recipe.dto';
import { IsOptional } from 'class-validator';

export class UpdateRecipeDto extends PartialType(CreateRecipeDto) {
  @IsOptional()
  deletedImages: string[];
}
