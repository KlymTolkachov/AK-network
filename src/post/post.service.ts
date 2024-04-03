import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {PostDocument, PostModel} from "./post.model";
import {Model} from "mongoose";
import {CreatePostDto} from "./dto/create-post.dto";
import {UserDocument, UserModel} from "../user/user.model";
import {POST_NOT_FOUND_ERROR} from "./post.constants";
import {ObjectId} from "mongodb";
import {UpdatePostDto} from "./dto/update-post.dto";
import {FilesService} from "../files/files.service";
import {UpdateStatusPostDto} from "./dto/update-status-post.dto";

@Injectable()
export class PostService {
    constructor(@InjectModel(PostModel.name) private readonly postModel: Model<PostDocument>,
                @InjectModel(UserModel.name) private readonly userModel: Model<UserDocument>,
                private readonly filesService: FilesService) {
    }

    async create(dto: CreatePostDto, id: string, files) {
        const post = new this.postModel({...dto, owner: id});
        const savedPost = await post.save();
        await this.userModel.findByIdAndUpdate(id, {$push: {posts: savedPost.id}}, {new: true});

        const filesId = await this.filesService.savePostPhotos(files, savedPost.id);
        return this.postModel.findByIdAndUpdate(savedPost.id, {photos: filesId}, {new: true});
    }

    async delete(postId: string, id: string) {
        const post = await this.postModel.findByIdAndDelete(postId).exec();
        await this.userModel.updateOne({_id: new ObjectId(id)}, {$pull: {posts: postId}})
        if (!post) {
            throw new NotFoundException(POST_NOT_FOUND_ERROR)
        }
    }

    async update(postId: string, dto: UpdatePostDto) {
        const post = await this.postModel.findByIdAndUpdate(postId, dto, {new: true}).exec();
        if (!post) {
            throw new NotFoundException(POST_NOT_FOUND_ERROR)
        }
        return post;
    }


    async findById(id: string) {
        const post = await this.postModel.findById(id).exec();
        if (!post) {
            throw new NotFoundException(POST_NOT_FOUND_ERROR)
        }
        return post;
    }

    async feedOfPosts(skip = 0, limit = 10) {
        return await this.postModel.aggregate([
            {
                $sort: {
                    updatedAt: -1
                }
            }
        ]).skip(+skip).limit(+limit).exec();
    }


    async toggleStatus(id: string, dto, userId) {
        await this.findById(id);
        dto.saved ? dto.saved = {$not: '$saved'} : null;
        dto.archived ? dto.archived = {$not: '$archived'} : null;
        if (dto.likes) {

        }
        return this.postModel.findByIdAndUpdate(id, [{$set: dto}], {new: true});
    }
}
