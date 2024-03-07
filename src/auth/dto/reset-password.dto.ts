import {ApiProperty} from "@nestjs/swagger";
import {IsString} from "class-validator";

export class ResetPasswordDto {
    @ApiProperty({
        description: 'new Password',
        example: 'Password!12345'
    })
    @IsString()
    newPassword: string;
}