import {Controller, Get, NotFoundException, UseGuards} from '@nestjs/common';
import {UserService} from "./user.service";
import {UserData} from "../decorators/user-data.decorator";
import {USER_NOT_FOUND_ERROR} from "./user.constants";
import {JwtAuthGuard} from "../auth/guards/jwt.guard";
import {ApiOkResponse, ApiTags, ApiUnauthorizedResponse} from "@nestjs/swagger";
import {UserModel} from "./user.model";

@ApiTags('User')
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    @ApiOkResponse({description: 'User', type: UserModel})
    @ApiUnauthorizedResponse({description: 'Unauthorized'})
    @UseGuards(JwtAuthGuard)
    @Get('/')
    async find(@UserData() {id}) {
        const user = this.userService.findById(id);
        if (!user) {
            throw new NotFoundException(USER_NOT_FOUND_ERROR);
        }
        return user;
    }
}
