import {
    BadRequestException,
    Controller, Get, Param,
    Post,
    UploadedFiles, UseGuards,
    UseInterceptors, UsePipes, ValidationPipe,
} from '@nestjs/common';
import {FilesInterceptor} from '@nestjs/platform-express';
import {FileElementResponse} from './dto/file-element.res';
import {FilesService} from './files.service';
import {MFile} from './mFile.class';
import {JwtAuthGuard} from "../auth/guards/jwt.guard";
import {AuthService} from "../auth/auth.service";
import * as sharp from 'sharp';
import {FILE_NOT_FOUND_ERROR} from "./file.constants";
import {IdValidationPipe} from "../pipes/id-validation.pipe";
import {ApiTags} from "@nestjs/swagger";

@ApiTags('Files')
@Controller('files')
export class FilesController {
    constructor(private readonly filesService: FilesService,
                private readonly authService: AuthService) {
    }

    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    @Post('upload')
    @UseInterceptors(FilesInterceptor('files', 10))
    async uploadFile(@UploadedFiles() files): Promise<FileElementResponse[]> {
        const saveArray: MFile[] = [];
        for (const file of files) {
            if (!file.mimetype.includes('image')) {
                throw new BadRequestException(`invalid type of file: ${file.originalname}. Only images accept!`)
            }
        }
        for (const file of files) {
            const buffer = await this.filesService.convertToWebP(file.buffer);
            saveArray.push(
                new MFile({
                    originalname: `${file.originalname.split('.')[0]}.webp`,
                    buffer,
                }),
            );
        }
        return this.filesService.saveFiles(saveArray, '');
    }

    @Get('download/:id')
    async downloadFile(@Param('id', IdValidationPipe) id: string) {
        const file = await this.filesService.downloadFile(id);
        if (!file) {
            throw new BadRequestException(FILE_NOT_FOUND_ERROR)
        }
        return await sharp(file.data).toBuffer()

    }
}
