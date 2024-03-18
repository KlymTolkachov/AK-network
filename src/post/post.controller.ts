import {Body, Controller, Post, UseGuards, UsePipes, ValidationPipe} from '@nestjs/common';
import {PostService} from "./post.service";
import {CreatePostDto} from "./dto/create-post.dto";
import {JwtAuthGuard} from "../auth/guards/jwt.guard";
import {UserData} from "../decorators/user-data.decorator";

@Controller('posts')
export class PostController {
    constructor(private readonly postService: PostService) {
    }


    @UsePipes(new ValidationPipe())
    @UseGuards(JwtAuthGuard)
    @Post('/')
    async create(@Body() dto: CreatePostDto, @UserData() {id}) {
        return this.postService.create(dto, id);
    }
}
