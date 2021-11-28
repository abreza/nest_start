import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { UserRoleRo } from './user-role.ro';

export class UserRo {
  @Expose()
  @ApiProperty()
  public readonly username: string;

  @Expose()
  @ApiProperty()
  public readonly firstName: string;

  @Expose()
  @ApiProperty()
  public readonly lastName: string;

  @Expose()
  @ApiProperty()
  public readonly email: string;

  @Expose({ name: 'roles' })
  @Type(() => UserRoleRo)
  @Transform(({ value }: { value: UserRoleRo[] }) => {
    const roleNames = [];
    value?.forEach((element) => {
      roleNames.push(element.name);
    });
    return roleNames;
  })
  @Type(() => String)
  @ApiProperty()
  public readonly roleNames: string[];
}
