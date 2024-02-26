import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument} from 'mongoose';

export type UserDocument = HydratedDocument<UserModel>;

@Schema({timestamps: true, versionKey: false})
export class UserModel {
    @Prop({isRequired: true, unique: true})
    email: string;

    @Prop({required: true})
    passwordHash: string;
}

export const UserSchema = SchemaFactory.createForClass(UserModel);