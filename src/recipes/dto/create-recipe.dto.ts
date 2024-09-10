import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString } from 'class-validator';

export class CreateRecipeDto {
  @ApiProperty()
  @IsNotEmpty()
  title: string;
  @ApiProperty()
  @IsNotEmpty()
  content: string;
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    format: 'text',
    isArray: true,
    required: true,
  })
  ingredients: string[];
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    format: 'text',
    isArray: true,
    required: true,
  })
  instructions: string[];
  @IsNumberString()
  @IsNotEmpty()
  @ApiProperty()
  category: number;
  @ApiProperty({
    type: 'string',
    format: 'binary',
    isArray: true,
    required: true,
  })
  files: Array<Express.Multer.File>;
}
