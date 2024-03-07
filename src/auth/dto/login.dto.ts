import {IsString} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class LoginDto {
    @ApiProperty({
        description: 'user email, uniq',
        example: 'example@gmail.com'
    })
    @IsString()
    login: string;

    @ApiProperty({
        description: 'user password',
        example: 'Password_12345',
    })
    @IsString()
    password: string;
}