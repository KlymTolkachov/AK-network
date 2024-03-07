import {IsNotEmpty, IsString} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({
        description: 'user email, uniq',
        example: 'example@gmail.com'
    })
    @IsNotEmpty()
    @IsString()
    email: string;

    @ApiProperty({
        description: 'user password',
        example: 'Password_12345',
    })
    @IsNotEmpty()
    @IsString()
    password: string;

    @ApiProperty({
        description: 'user nickname',
        example: '@Hello',
    })
    @IsNotEmpty()
    @IsString()
    nickname: string;

    @ApiProperty({
        description: 'avatar, profile picture',
        example: 'avatar.jpeg',
    })
    avatar: Express.Multer.File;
}