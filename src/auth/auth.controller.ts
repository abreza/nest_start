import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  HttpCode,
  Inject,
  Headers,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { LoginRo } from './dto/login.ro';
import { UserRo } from 'src/users/dto/user.ro';
import { TokenRo } from './dto/token.ro';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';
import { UserCreateDto } from 'src/users/dto/user-create.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthService)
    private readonly authService: AuthService,
    @Inject(UsersService)
    private readonly usersService: UsersService,
  ) {}

  @Post()
  @HttpCode(200)
  @ApiBody({ type: LoginDto })
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Login' })
  @ApiOkResponse({ type: LoginRo })
  async login(@Request() { user }: { user: UserRo }): Promise<LoginRo> {
    return await this.authService.login(user);
  }

  @Post('signup')
  @ApiBody({ type: UserCreateDto })
  @ApiOperation({ summary: 'Login' })
  @ApiCreatedResponse({ type: LoginRo })
  async signup(@Body() userCreateDto: UserCreateDto): Promise<LoginRo> {
    const user = await this.usersService.create(userCreateDto);
    return await this.login({ user });
  }

  @Post('verifyToken')
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiOperation({ summary: 'Verify Token' })
  @ApiOkResponse({ type: TokenRo })
  async verify(
    @Headers('Authorization') bearerToken: string,
  ): Promise<TokenRo> {
    return await this.authService.validateToken(bearerToken);
  }
}
