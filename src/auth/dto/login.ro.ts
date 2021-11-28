import { ApiProperty } from '@nestjs/swagger';
import { UserRo } from 'src/users/dto/user.ro';

export class LoginRo {
  @ApiProperty()
  public token: string;

  @ApiProperty()
  public user: UserRo;
}
