import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRoleDto } from './dto/user-role.dto';
import { CheckPermissionDto } from 'src/users/dto/check-permission.dto';
import { configService } from 'src/config.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { Role } from 'src/roles/schemas/role.schema';
import { ForbiddenException } from '@nestjs/common';
import { ObjectID } from 'mongodb';

@Injectable()
export class UserRolesService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectModel(Role.name)
    private roleModel: Model<Role>,
  ) {}

  async assignRole(userRoleDto: UserRoleDto): Promise<void> {
    const { username, roleIds } = userRoleDto;

    roleIds.forEach((roleId) => {
      if (!ObjectID.isValid(roleId)) {
        throw new NotFoundException();
      }
    });

    const roles = await this.roleModel.find({ _id: { $in: roleIds } });

    if (roles.length != roleIds.length) {
      throw new NotFoundException('Role not found.');
    }

    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    user.roles = roles;
    await user.save();
  }

  async checkPermission(checkPermissionDto: CheckPermissionDto): Promise<void> {
    const { username, permissions } = checkPermissionDto;
    if (username === configService.getSuperUser().username) return;

    const user = await this.userModel
      .findOne({
        username,
      })
      .populate('roles');

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const userPermissions: string[] = [].concat(
      ...user.roles.map((role) => role.permissions),
    );

    permissions.forEach((permission) => {
      if (!userPermissions.includes(permission))
        throw new ForbiddenException(
          `You do not have permission ${permission}`,
        );
    });
  }
}
