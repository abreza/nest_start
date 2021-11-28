import { ApiProperty } from '@nestjs/swagger';
import { PermissionTag } from '../enum/permission-tag.enum';
import { PermissionView } from '../types/permission-view.type';

export class PermissionViewRo {
  @ApiProperty()
  public readonly id: string;

  @ApiProperty()
  public readonly category: string;

  @ApiProperty()
  public readonly group: string;

  @ApiProperty()
  public readonly name: string;

  constructor(id: PermissionTag, permissionView: PermissionView) {
    this.id = id;
    this.category = permissionView.category;
    this.group = permissionView.group;
    this.name = permissionView.name;
  }
}
