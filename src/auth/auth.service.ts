import { UnauthorizedException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRo } from '../users/dto/user.ro';
import { LoginRo } from './dto/login.ro';
import { TokenRo } from './dto/token.ro';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(userRo: UserRo): Promise<LoginRo> {
    const { username } = userRo;
    return {
      token: await this.jwtService.signAsync({ username }),
      user: userRo,
    };
  }

  async validateToken(bearerToken: string): Promise<TokenRo> {
    try {
      const token = bearerToken.replace('Bearer ', '');
      const user = await this.jwtService.verifyAsync(token);
      return {
        username: user.username,
      };
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
