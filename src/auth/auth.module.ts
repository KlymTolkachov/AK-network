import {Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {MongooseModule} from "@nestjs/mongoose";
import {UserModel, UserSchema} from "./user.model";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {JwtModule} from "@nestjs/jwt";
import {getJWTConfig} from "../configs/jwt.config";
import {PassportModule} from "@nestjs/passport";
import {JwtStrategy} from "./strategies/jwt.strategy";
import {FilesService} from "../files/files.service";
import {FileModel, FileSchema} from "../files/file.model";

@Module({
    controllers: [AuthController],
    imports: [
        MongooseModule.forFeature([
            {
                name: UserModel.name,
                schema: UserSchema,
                collection: 'Users'
            },
            {
                name: FileModel.name,
                schema: FileSchema,
                collection: 'Profiles-pictures',
            },
        ]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: getJWTConfig,
        }),
        ConfigModule,
        PassportModule,
    ],
    providers: [AuthService, JwtStrategy, FilesService],
    exports: [AuthService]
})
export class AuthModule {
}
