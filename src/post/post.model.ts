import {HydratedDocument, Types} from "mongoose";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {UserModel} from "../user/user.model";
import {ApiProperty} from "@nestjs/swagger";

export type PostDocument = HydratedDocument<PostModel>

@Schema({timestamps: true, versionKey: false})
export class PostModel {
    @ApiProperty({
        description: 'post title',
        example: 'My post title'
    })
    @Prop({required: true})
    title: string;

    @ApiProperty({
        description: 'post text',
        example: 'My post text'
    })
    @Prop({required: true})
    text: string;

    @ApiProperty({
        description: 'post like',
    })
    @Prop()
    likes: [string];

    @ApiProperty({
        description: 'post comments',
        example: 'example comment'
    })
    @Prop()
    comments: string;

    @ApiProperty({
        description: 'post owner',
        example: '@Hello'
    })
    @Prop({type: Types.ObjectId, ref: 'Users', required: true})
    owner: UserModel;

}

export const PostSchema = SchemaFactory.createForClass(PostModel);