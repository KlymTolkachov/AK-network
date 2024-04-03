import {ApiProperty} from "@nestjs/swagger";
import {IsOptional} from "class-validator";

export class UpdateStatusPostDto {
    @ApiProperty({
        description: 'post like',
        example: 'true'
    })
    @IsOptional()
    likes: {
        icon: Buffer,
        name: string
    };

    @ApiProperty({
        description: 'is post in saved folder',
        example: 'true'
    })
    @IsOptional()
    saved: boolean;

    @ApiProperty({
        description: 'is post in archived folder',
        example: 'false'
    })
    @IsOptional()
    archived: boolean;
}