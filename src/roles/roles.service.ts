import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { RoleIdDto } from './dto/role-id.dto';
import { RoleDto } from './dto/role.dto';
import { RoleRo } from './dto/role.ro';
import { RolesRo } from './dto/roles.ro';
import { Role } from './schemas/role.schema';
import { UpdateRoleDto } from './dto/role-update.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PermissionTag } from './enum/permission-tag.enum';
import { PermissionViewRo } from './dto/permission-view.ro';
import { permissionsView } from './enum/permission-tag.enum';
import { ObjectID } from 'mongodb';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name)
    private rolesModel: Model<Role>,
  ) {}

  async readPermissions(): Promise<PermissionViewRo[]> {
    return Object.keys(permissionsView).map(
      (key: PermissionTag) => new PermissionViewRo(key, permissionsView[key]),
    );
  }

  async createRole(roleDto: RoleDto): Promise<RoleRo> {
    try {
      const role = await this.rolesModel.create(roleDto);
      await role.save();
      return plainToClass(RoleRo, role, { excludeExtraneousValues: true });
    } catch (err) {
      console.log(err);
      if (err.name === 'MongoError' && err.code === 11000) {
        // Duplicate username
        throw new UnprocessableEntityException({
          message: 'Role already exist!',
        });
      }
      throw err;
    }
  }

  async updateRole(updateRoleDto: UpdateRoleDto): Promise<void> {
    const { id } = updateRoleDto;
    const role = await this.rolesModel.updateOne({ id }, updateRoleDto);
    if (!role) {
      throw new NotFoundException();
    }
  }

  async readRole(roleId: string): Promise<RoleRo> {
    if (!ObjectID.isValid(roleId)) {
      throw new NotFoundException();
    }
    const role = await this.rolesModel.findOne({ _id: roleId });
    if (!role) {
      throw new NotFoundException();
    }
    return plainToClass(RoleRo, role, { excludeExtraneousValues: true });
  }

  async findRole({}): Promise<RolesRo> {
    const role = await this.rolesModel.find();
    return plainToClass(
      RolesRo,
      { roles: role },
      { excludeExtraneousValues: true },
    );
  }

  async deleteRole(roleIdDto: RoleIdDto): Promise<void> {
    const del = await this.rolesModel.deleteOne(roleIdDto);
    if (!del.deletedCount) {
      throw new NotFoundException();
    }
  }
}
