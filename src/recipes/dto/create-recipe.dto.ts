import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateRecipeDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsNotEmpty()
  content: string;
  @IsString()
  @IsNotEmpty()
  ingredients: string;
  @IsString()
  @IsNotEmpty()
  instructions: string;
  @IsNumber()
  @IsNotEmpty()
  user: number;
  @IsNumber()
  @IsNotEmpty()
  category: number;
}
