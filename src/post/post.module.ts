import {Module} from '@nestjs/common';
import {PostController} from './post.controller';
import {PostService} from './post.service';
import {MongooseModule} from "@nestjs/mongoose";
import {PostModel, PostSchema} from "./post.model";
import {UserModel, UserSchema} from "../user/user.model";
import {FileModel, FileSchema} from "../files/file.model";
import {FilesService} from "../files/files.service";

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
            {
                name: FileModel.name,
                schema: FileSchema,
                collection: 'Post-pictures',
            },
        ])
    ],
    controllers: [PostController],
    providers: [PostService, FilesService]
})
export class PostModule {
}
