import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserRo } from '../users/dto/user.ro';
import { configService } from 'src/config.service';
import { plainToClass } from 'class-transformer';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(UsersService) private readonly usersService: UsersService,
  ) {
    super();
  }

  async validate(username: string, password: string): Promise<UserRo> {
    const superUser = configService.getSuperUser();
    if (username === superUser.username && password === superUser.password) {
      return plainToClass(UserRo, {
        username: superUser.username,
        firstName: 'admin',
        lastName: 'admin',
        nationalId: '1234567890',
      });
    }

    return await this.usersService.validate(username, password);
  }
}
