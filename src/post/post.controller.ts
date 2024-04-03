import {
    Body,
    Controller,
    Delete, Get,
    HttpCode,
    Param,
    Patch,
    Post, Query, UploadedFiles,
    UseGuards, UseInterceptors,
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
    ApiNoContentResponse, ApiNotFoundResponse,
    ApiOkResponse, ApiQuery,
    ApiTags,
    ApiUnauthorizedResponse
} from "@nestjs/swagger";
import {PostModel} from "./post.model";
import {FilesInterceptor} from "@nestjs/platform-express";
import {UpdateStatusPostDto} from "./dto/update-status-post.dto";

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
    @UseInterceptors(FilesInterceptor('photos', 5))
    @Post('/')
    async create(@UploadedFiles() files: Express.Multer.File[], @Body() dto: CreatePostDto, @UserData() {id}) {
        return this.postService.create(dto, id, files);
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

    @ApiOkResponse({description: 'User updated post success', type: PostModel})
    @ApiNotFoundResponse({description: 'Page not found'})
    @ApiBadRequestResponse({description: 'Invalid Id'})
    @ApiUnauthorizedResponse({description: 'Unauthorized'})
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findById(@Param('id', IdValidationPipe) id: string) {
        return this.postService.findById(id);
    }


    @ApiOkResponse({description: 'All posts', type: [PostModel]})
    @ApiUnauthorizedResponse({description: 'Unauthorized'})
    @UseGuards(JwtAuthGuard)
    @Get('/')
    async feedOfPosts(@Query() {limit, skip}) {
        return this.postService.feedOfPosts(skip, limit);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/:postId/status')
    async toggleStatus(@Param('postId', IdValidationPipe) postId: string,
                       @Body() dto: UpdateStatusPostDto,
                       @UserData() {id}) {
        return this.postService.toggleStatus(postId, dto, id)
    }


}
