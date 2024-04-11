import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {UserDocument, UserModel} from "./user.model";
import {Model} from "mongoose";

@Injectable()
export class UserService {
    constructor(@InjectModel(UserModel.name) private readonly userModel: Model<UserDocument>) {
    }

    async findById(id: string) {
        return this.userModel.findById(id).exec();
    }

    async findByNickname(nickname: string) {
        return this.userModel.findOne({nickname}).exec();
    }

    async getFollowers(id: string) {
        return this.userModel.aggregate([])
    }

    async getFollowings(id: string) {
        return this.userModel.aggregate([])
    }


}
