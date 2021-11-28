import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { RoleRo } from './role.ro';

export class RolesRo {
  @Type(() => RoleRo)
  @ApiProperty({ type: [RoleRo] })
  @Expose()
  public roles: RoleRo[];
}
