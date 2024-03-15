import {Injectable} from '@nestjs/common';
import {FileElementResponse} from './dto/file-element.res';
import * as sharp from 'sharp';
import {MFile} from './mFile.class';
import {InjectModel} from '@nestjs/mongoose';
import {FileDocument, FileModel} from './file.model';
import {Model} from 'mongoose';

@Injectable()
export class FilesService {
    constructor(@InjectModel(FileModel.name) private readonly fileModel: Model<FileDocument>) {
    }

    async saveFiles(files: MFile[], id: string): Promise<FileElementResponse[]> {
        const res: FileElementResponse[] = [];

        for (const file of files) {
            const buffer = await this.convertToWebP(file.buffer)
            const newFile = new this.fileModel({
                name: file.originalname,
                data: buffer,
                owner: id
            });
            const savedFile = await newFile.save();
            res.push({id: savedFile.id, name: savedFile.name})
        }
        return res;
    }

    convertToWebP(file: Buffer): Promise<Buffer> {
        return sharp(file).webp().toBuffer();
    }

    async downloadFile(id: string) {
        return this.fileModel.findById(id);
    }
}