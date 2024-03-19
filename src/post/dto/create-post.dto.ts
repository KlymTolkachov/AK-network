import {IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreatePostDto {
    @ApiProperty({
        description: 'post title',
        example: 'My post title'
    })
    @IsString()
    title: string;

    @ApiProperty({
        description: 'post text',
        example: 'My post text'
    })
    @IsString()
    text: string;
}