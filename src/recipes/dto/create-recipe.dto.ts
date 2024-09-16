import { IsNotEmpty, IsNumber, IsNumberString, IsString } from 'class-validator';

export class CreateRecipeDto {
  @IsNotEmpty()
  @IsString()
  title: string;
  @IsNotEmpty()
  @IsString()
  content: string;
  @IsNotEmpty()
  ingredients: string[];
  @IsNotEmpty()
  instructions: string[];
  @IsNumber()
  @IsNotEmpty()
  category: number;
}
