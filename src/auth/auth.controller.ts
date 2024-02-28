import {BadRequestException, Body, Controller, HttpCode, Post, UsePipes, ValidationPipe} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {ALREADY_REGISTERED_ERROR} from "./auth.constants";
import {CreateUserDto} from "./dto/create-user.dto";
import {
    ApiBadRequestResponse,
    ApiCreatedResponse,
    ApiDefaultResponse,
    ApiOkResponse,
    ApiTags,
    ApiUnauthorizedResponse
} from "@nestjs/swagger";
import {UserModel} from "./user.model";

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @ApiCreatedResponse({description: 'User created', type: UserModel})
    @ApiBadRequestResponse({description: 'User cann\'t register. Try again!'})
    @UsePipes(new ValidationPipe())
    @Post('register')
    async register(@Body() dto: CreateUserDto) {
        const oldUser = await this.authService.findUser(dto.login);
        if (oldUser) {
            throw new BadRequestException(ALREADY_REGISTERED_ERROR);
        }
        return await this.authService.createUser(dto);
    }

    @ApiOkResponse({description: 'User logged in success'})
    @ApiBadRequestResponse({description: 'User cann\'t login. Try again!'})
    @ApiUnauthorizedResponse({description: 'Unauthorized'})
    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Post('login')
    async login(@Body() {login, password}: CreateUserDto) {
        const {email} = await this.authService.validateUser(login, password);
        return this.authService.login(email);
    }
}
