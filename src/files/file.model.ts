import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument, Types} from 'mongoose';
import {UserModel} from "../user/user.model";

export type FileDocument = HydratedDocument<FileModel>;

@Schema({timestamps: true, versionKey: false})
export class FileModel {
    @Prop()
    name: string;

    @Prop({type: Types.ObjectId, ref: 'Users'})
    owner: UserModel;

    @Prop({type: Buffer})
    data: Buffer;

    @Prop()
    type: 'post' | 'avatar';
}

export const FileSchema = SchemaFactory.createForClass(FileModel);
