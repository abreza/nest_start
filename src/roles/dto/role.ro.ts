import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PermissionTag } from '../enum/permission-tag.enum';

export class RoleRo {
  @Expose({ name: '_id' })
  @Type(() => String)
  @ApiProperty()
  public id: string;

  @ApiProperty()
  @Expose()
  public name: string;

  @ApiProperty({
    type: 'array',
    items: {
      enum: Object.keys(PermissionTag),
    },
  })
  @Expose()
  public permissions: PermissionTag[];
}
