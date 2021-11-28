import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { UserRo } from './user.ro';

export class UsersRo {
  @Expose()
  @Type(() => UserRo)
  @ApiProperty({ type: [UserRo] })
  public readonly users: UserRo[];
}
