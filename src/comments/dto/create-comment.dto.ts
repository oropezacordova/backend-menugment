import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCommentDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    content: string;
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    user: number;
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    recipe: number;
}
