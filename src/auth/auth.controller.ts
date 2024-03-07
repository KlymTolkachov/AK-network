import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    Patch,
    Post, UploadedFile,
    UseGuards, UseInterceptors,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {ALREADY_REGISTERED_ERROR, WRONG_NICKNAME_ERROR} from "./auth.constants";
import {CreateUserDto} from "./dto/create-user.dto";
import {
    ApiBadRequestResponse,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiTags,
    ApiUnauthorizedResponse
} from "@nestjs/swagger";
import {UserModel} from "./user.model";
import {LoginDto} from "./dto/login.dto";
import {ResetPasswordDto} from "./dto/reset-password.dto";
import {JwtAuthGuard} from "./guards/jwt.guard";
import {UserData} from "../decorators/user-data.decorator";
import {FileInterceptor} from "@nestjs/platform-express";

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @ApiCreatedResponse({description: 'User created', type: UserModel})
    @ApiBadRequestResponse({description: 'User cann\'t register. Try again!'})
    @UsePipes(new ValidationPipe())
    @UseInterceptors(FileInterceptor('avatar'))
    @Post('register')
    async register(@UploadedFile() file: Express.Multer.File, @Body() dto: CreateUserDto) {
        const oldUser = await this.authService.findUser(dto.email);
        if (oldUser) {
            throw new BadRequestException(ALREADY_REGISTERED_ERROR);
        }
        const busyNickName = await this.authService.findUserByNickName(dto.nickname)
        if (busyNickName) {
            throw new BadRequestException(WRONG_NICKNAME_ERROR);
        }
        return await this.authService.createUser(dto, file);
    }

    @ApiOkResponse({description: 'User logged in success'})
    @ApiBadRequestResponse({description: 'User cann\'t login. Try again!'})
    @ApiUnauthorizedResponse({description: 'Unauthorized'})
    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Post('login')
    async login(@Body() {login, password}: LoginDto) {
        const {email, id} = await this.authService.validateUser(login, password);
        return this.authService.login(email, id);
    }

    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    @HttpCode(204)
    @Patch('reset-password')
    async resetPassword(@Body() dto: ResetPasswordDto, @UserData() email: string) {
        return this.authService.resetPassword(dto, email)
    }
}
