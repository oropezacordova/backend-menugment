import { ArrayNotEmpty, IsNotEmpty, IsString } from 'class-validator';

export class CreateRecipeDto {
  @IsNotEmpty()
  @IsString()
  title: string;
  @IsNotEmpty()
  @IsString()
  content: string;
  @ArrayNotEmpty()
  @IsString({ each: true })
  ingredients: string[];
  @ArrayNotEmpty()
  @IsString({ each: true })
  instructions: string[];
  @IsNotEmpty()
  category: number;
}
