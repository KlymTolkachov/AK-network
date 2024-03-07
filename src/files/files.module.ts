import {Module} from '@nestjs/common';
import {FilesController} from './files.controller';
import {FilesService} from './files.service';
import {ServeStaticModule} from '@nestjs/serve-static';
import path from 'app-root-path';
import {MongooseModule} from '@nestjs/mongoose';
import {FileModel, FileSchema} from './file.model';
import {UserModel, UserSchema} from "../auth/user.model";
import {AuthModule} from "../auth/auth.module";


@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: `${path}/uploads`,
            serveRoot: '/static',
        }),
        MongooseModule.forFeature([
            {
                name: FileModel.name,
                schema: FileSchema,
                collection: 'filesToDb',
            },
            {
                name: UserModel.name,
                schema: UserSchema,
                collection: 'Users'
            },
        ]),
        AuthModule,
    ],
    controllers: [FilesController],
    providers: [FilesService],
    exports: [FilesService]
})
export class FilesModule {
}
