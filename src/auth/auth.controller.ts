import {BadRequestException, Body, Controller, HttpCode, Post, UsePipes, ValidationPipe} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {ALREADY_REGISTERED_ERROR} from "./auth.constants";
import {CreateUserDto} from "./dto/create-user.dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @UsePipes(new ValidationPipe())
    @Post('register')
    async register(@Body() dto: CreateUserDto) {
        const oldUser = await this.authService.findUser(dto.login);
        if (oldUser) {
            throw new BadRequestException(ALREADY_REGISTERED_ERROR);
        }
        return await this.authService.createUser(dto);
    }

    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Post('login')
    async login(@Body() {login, password}: CreateUserDto) {
        const {email} = await this.authService.validateUser(login, password);
        return this.authService.login(email);
    }
}
