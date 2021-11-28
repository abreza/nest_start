import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserRoleRo {
  @Expose()
  @ApiProperty()
  public readonly id: string;

  @Expose()
  @ApiProperty()
  public readonly name: string;
}
