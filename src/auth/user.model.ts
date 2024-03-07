import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument} from 'mongoose';
import {ApiProperty} from "@nestjs/swagger";

export type UserDocument = HydratedDocument<UserModel>;

@Schema({timestamps: true, versionKey: false})
export class UserModel {

    @ApiProperty({
        description: 'user email, uniq',
        example: 'example@gmail.com'
    })
    @Prop({required: true, unique: true})
    email: string;

    @ApiProperty({
        description: 'user password hash',
        example: 'Password_12345',
    })
    @Prop({required: true})
    passwordHash: string;

    @ApiProperty({
        description: 'profile picture',
    })
    @Prop({required: true})
    avatar: string;

    @ApiProperty({
        description: 'user nickname',
        example: '@Hello',
    })
    @Prop({required: true, unique: true})
    nickname: string;

    @ApiProperty({
        description: 'user followings',
    })
    @Prop()
    following: [string];

    @ApiProperty({
        description: 'user followers',
    })
    @Prop()
    followers: [string];


    @ApiProperty({
        description: 'user posts',
    })
    @Prop()
    posts: [string]
}

export const UserSchema = SchemaFactory.createForClass(UserModel);