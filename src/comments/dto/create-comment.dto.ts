import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;
  @IsNumber()
  @IsNotEmpty()
  user: number;
  @IsNumber()
  @IsNotEmpty()
  recipe: number;
}
