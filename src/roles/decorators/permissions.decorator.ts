import { SetMetadata } from '@nestjs/common';
import { PermissionTag } from '../enum/permission-tag.enum';

export const Permissions = (...permissions: PermissionTag[]) =>
  SetMetadata('permissions', permissions);
