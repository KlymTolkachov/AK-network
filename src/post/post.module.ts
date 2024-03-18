import {Module} from '@nestjs/common';
import {PostController} from './post.controller';
import {PostService} from './post.service';
import {MongooseModule} from "@nestjs/mongoose";
import {PostModel, PostSchema} from "./post.model";
import {UserModel, UserSchema} from "../user/user.model";

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: PostModel.name,
                schema: PostSchema,
                collection: 'Posts'
            },
            {
                name: UserModel.name,
                schema: UserSchema,
                collection: 'Users'
            },
        ])
    ],
    controllers: [PostController],
    providers: [PostService]
})
export class PostModule {
}
