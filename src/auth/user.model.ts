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
    @Prop({isRequired: true, unique: true})
    email: string;

    @ApiProperty({
        description: 'user password hash',
        example: 'Password_12345',
    })
    @Prop({required: true})
    passwordHash: string;
}

export const UserSchema = SchemaFactory.createForClass(UserModel);