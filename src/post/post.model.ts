import {HydratedDocument, Types} from "mongoose";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {UserModel} from "../user/user.model";

export type PostDocument = HydratedDocument<PostModel>

@Schema({timestamps: true, versionKey: false})
export class PostModel {
    @Prop({required: true})
    title: string;

    @Prop({required: true})
    text: string;

    @Prop()
    likes: [string];

    @Prop()
    comments: string;

    @Prop({type: Types.ObjectId, ref: 'Users', required: true})
    owner: UserModel;

}

export const PostSchema = SchemaFactory.createForClass(PostModel);