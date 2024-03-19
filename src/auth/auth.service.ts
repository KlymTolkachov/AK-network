import {Injectable, UnauthorizedException} from '@nestjs/common';
import {CreateUserDto} from "./dto/create-user.dto";
import {USER_NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR} from "./auth.constants";
import {InjectModel} from "@nestjs/mongoose";
import {JwtService} from "@nestjs/jwt";
import {Model} from "mongoose";
import {compare, genSalt, hash} from "bcryptjs";
import {UserDocument, UserModel} from "../user/user.model";
import {ResetPasswordDto} from "./dto/reset-password.dto";
import {FilesService} from "../files/files.service";
import {MFile} from "../files/mFile.class";
import {UserService} from "../user/user.service";

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(UserModel.name) private readonly userModel: Model<UserDocument>,
        private readonly jwtService: JwtService,
        private readonly fileService: FilesService,
        private readonly userService: UserService,
    ) {
    }

    async createUser(dto: CreateUserDto, avatar: Express.Multer.File) {
        const salt = await genSalt(10);
        const newUser = new this.userModel({
            email: dto.email,
            passwordHash: await hash(dto.password, salt),
            nickname: dto.nickname,
            avatar: 'avatar.jpeg'
        });
        const savedUser = await newUser.save();
        if (avatar) {
            const savedAvatar = await this.fileService.saveFiles([new MFile(avatar)], String(savedUser.id))
            return this.userModel.findByIdAndUpdate(savedUser.id, {avatar: savedAvatar[0].id}, {new: true})
        }
        return savedUser
    }

    async findUser(email: string) {
        return this.userModel.findOne({email}).exec();
    }

    async findUserByNickName(nickname: string) {
        return this.userModel.findOne({nickname}).exec();
    }


//: Promise<Pick<UserModel, 'email' | '_id'>>
    async validateUser(email: string, password: string) {
        const user = await this.findUser(email);
        if (!user) {
            throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
        }
        const isCorrectPassword = await compare(password, user.passwordHash);
        if (!isCorrectPassword) {
            throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
        }
        return {email: user.email, id: String(user._id)};
    }

    async login(email: string, id: string) {
        const payload = {email, id};
        const user = await this.userService.findById(id);
        delete user['passwordHash'];
        // console.log(user)
        return {
            accessToken: await this.jwtService.signAsync(payload),
            user,
        };
    }

    async resetPassword(dto: ResetPasswordDto, email: string) {
        const user = await this.findUser(email)
        const salt = await genSalt(10);
        return this.userModel.findByIdAndUpdate(user._id, {passwordHash: await hash(dto.newPassword, salt),})
    }
}
