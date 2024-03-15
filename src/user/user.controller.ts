import {Controller, Get, NotFoundException, UseGuards} from '@nestjs/common';
import {UserService} from "./user.service";
import {UserData} from "../decorators/user-data.decorator";
import {USER_NOT_FOUND_ERROR} from "./user.constants";
import {JwtAuthGuard} from "../auth/guards/jwt.guard";

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    @UseGuards(JwtAuthGuard)
    @Get('/')
    async find(@UserData() U) {
        const user = this.userService.findById(U.id);
        if (!user) {
            throw new NotFoundException(USER_NOT_FOUND_ERROR);
        }
        return user;
    }
}
