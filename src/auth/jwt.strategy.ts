import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { configService } from 'src/config.service';
import { UsersService } from 'src/users/users.service';
import { plainToClass } from 'class-transformer';
import { UserRo } from 'src/users/dto/user.ro';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(UsersService) private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getJwtConfig().secret,
    });
  }

  async validate(payload: any) {
    const superUser = configService.getSuperUser();
    if (payload.username === superUser.username) {
      return plainToClass(UserRo, {
        username: superUser.username,
        firstName: 'admin',
        lastName: 'admin',
        nationalId: '1234567890',
      });
    }

    return await this.usersService.findUserByUsername(payload.username);
  }
}
