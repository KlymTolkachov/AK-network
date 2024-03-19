import {IsOptional, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class UpdatePostDto {
    @ApiProperty({
        description: 'New post title',
        example: 'New my post title'
    })
    @IsOptional()
    @IsString()
    title: string;

    @ApiProperty({
        description: 'New post text',
        example: 'New my post text'
    })
    @IsOptional()
    @IsString()
    text: string;
}