import {PassportStrategy} from '@nestjs/passport';
import {Injectable} from '@nestjs/common';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {ConfigService} from '@nestjs/config';
import {UserDocument} from '../../user/user.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: configService.get('JWT_SECRET'),
        });
    }

    async validate(user: Pick<UserDocument, 'email' | 'id'>) {
        return user;
    }
}
