import {HydratedDocument, Types} from "mongoose";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {UserModel} from "../user/user.model";
import {ApiProperty} from "@nestjs/swagger";

export type PostDocument = HydratedDocument<PostModel>

@Schema({timestamps: true, versionKey: false})
export class PostModel {
    @ApiProperty({
        description: 'post photos',
        example: 'My picture'
    })
    @Prop({required: true})
    photos: [string];

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

    @ApiProperty({
        description: 'is post in saved folder',
        example: 'true'
    })
    @Prop({default: false})
    saved: boolean;

    @ApiProperty({
        description: 'is post in archived folder',
        example: 'false'
    })
    @Prop({default: false})
    archived: boolean;
}

export const PostSchema = SchemaFactory.createForClass(PostModel);