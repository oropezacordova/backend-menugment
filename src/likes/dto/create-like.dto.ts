import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateLikeDto {
  @IsNumber()
  @IsNotEmpty()
  user: number;
  @IsNumber()
  @IsNotEmpty()
  recipe: number;
}
