import {
    Body,
    Controller,
    Delete,
    HttpCode,
    Param,
    Patch,
    Post,
    UseGuards,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import {PostService} from "./post.service";
import {CreatePostDto} from "./dto/create-post.dto";
import {JwtAuthGuard} from "../auth/guards/jwt.guard";
import {UserData} from "../decorators/user-data.decorator";
import {IdValidationPipe} from "../pipes/id-validation.pipe";
import {UpdatePostDto} from "./dto/update-post.dto";
import {
    ApiBadRequestResponse, ApiCreatedResponse,
    ApiNoContentResponse,
    ApiOkResponse,
    ApiTags,
    ApiUnauthorizedResponse
} from "@nestjs/swagger";
import {PostModel} from "./post.model";

@ApiTags('Posts')
@Controller('posts')
export class PostController {
    constructor(private readonly postService: PostService) {
    }

    @ApiCreatedResponse({description: 'Post created', type: PostModel})
    @ApiBadRequestResponse({description: 'Invalid data'})
    @ApiUnauthorizedResponse({description: 'Unauthorized'})
    @UsePipes(new ValidationPipe())
    @UseGuards(JwtAuthGuard)
    @Post('/')
    async create(@Body() dto: CreatePostDto, @UserData() {id}) {
        return this.postService.create(dto, id);
    }

    @ApiNoContentResponse({description: 'User deleted post success', status: 204})
    @ApiBadRequestResponse({description: 'Invalid post ID'})
    @ApiUnauthorizedResponse({description: 'Unauthorized'})
    @UseGuards(JwtAuthGuard)
    @HttpCode(204)
    @Delete(':id')
    async delete(@Param('id', IdValidationPipe) postId: string, @UserData() {id}) {
        return this.postService.delete(postId, id);
    }

    @ApiOkResponse({description: 'User updated post success', type: PostModel})
    @ApiBadRequestResponse({description: 'Invalid data'})
    @ApiUnauthorizedResponse({description: 'Unauthorized'})
    @UsePipes(new ValidationPipe())
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async update(@Param('id', IdValidationPipe) postId: string, @Body() dto: UpdatePostDto) {
        return this.postService.update(postId, dto);
    }
}
