import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateLikeDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  user: number;
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  recipe: number;
}
