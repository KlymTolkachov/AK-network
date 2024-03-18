import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {PostDocument, PostModel} from "./post.model";
import {Model} from "mongoose";
import {CreatePostDto} from "./dto/create-post.dto";
import {UserDocument, UserModel} from "../user/user.model";

@Injectable()
export class PostService {
    constructor(@InjectModel(PostModel.name) private readonly postModel: Model<PostDocument>,
                @InjectModel(UserModel.name) private readonly userModel: Model<UserDocument>,) {
    }

    async create(dto: CreatePostDto, id: string) {
        const post = new this.postModel({...dto, owner: id});
        const savedPost = await post.save();
        await this.userModel.findByIdAndUpdate(id, {$push: {posts: savedPost.id}}, {new: true});
        return savedPost;
    }
}
