import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class CreateRecipeDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  content: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  ingredients: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  instructions: string;
  @IsNumberString()
  @IsNotEmpty()
  @ApiProperty()
  category: number;
  @ApiProperty({
    type: 'string',
    format: 'binary',
    isArray: true,
    required: false,
  })
  files: Array<Express.Multer.File>;
}
