import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument, Types} from 'mongoose';
import {UserModel} from "../auth/user.model";

export type FileDocument = HydratedDocument<FileModel>;

@Schema({timestamps: true, versionKey: false})
export class FileModel {
    @Prop()
    name: string;

    @Prop({type: Types.ObjectId, ref: 'Users'})
    owner: UserModel;

    @Prop({type: Buffer})
    data: Buffer;
}

export const FileSchema = SchemaFactory.createForClass(FileModel);
