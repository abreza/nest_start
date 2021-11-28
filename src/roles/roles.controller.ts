import {
  Body,
  Controller,
  Delete,
  Inject,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { RoleDto } from './dto/role.dto';
import { RolesService } from './roles.service';
import { RoleRo } from './dto/role.ro';
import { RoleIdDto } from './dto/role-id.dto';
import { RolesRo } from './dto/roles.ro';
import { UpdateRoleDto } from './dto/role-update.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Get } from '@nestjs/common';
import { PermissionViewRo } from './dto/permission-view.ro';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { PermissionTag } from './enum/permission-tag.enum';
import { Permissions } from './decorators/permissions.decorator';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(
    @Inject(RolesService) private readonly rolesService: RolesService,
  ) {}

  @Get('permissions')
  @ApiOperation({ summary: 'Get all permissions' })
  @ApiOkResponse({ type: [PermissionViewRo] })
  async readPermissions(): Promise<PermissionViewRo[]> {
    return await this.rolesService.readPermissions();
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(PermissionsGuard)
  @Permissions(PermissionTag.ADMIN)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Create a new role, It's for admins" })
  @ApiCreatedResponse({ type: RoleRo })
  async createRole(@Body() roleDto: RoleDto): Promise<RoleRo> {
    return await this.rolesService.createRole(roleDto);
  }

  @Put()
  @ApiBearerAuth()
  @UseGuards(PermissionsGuard)
  @Permissions(PermissionTag.ADMIN)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "Update information of an existing role, It's for admins",
  })
  async updateRole(@Body() updateRoleDto: UpdateRoleDto): Promise<void> {
    return await this.rolesService.updateRole(updateRoleDto);
  }

  @Get(':roleId')
  @ApiOperation({ summary: 'Get role by its id' })
  @ApiOkResponse({ type: RoleRo })
  async readRole(@Param('roleId') roleId: string): Promise<RoleRo> {
    return await this.rolesService.readRole(roleId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all roles' })
  @ApiOkResponse({ type: RolesRo })
  async findRole(): Promise<RolesRo> {
    return await this.rolesService.findRole({});
  }

  @Delete()
  @ApiBearerAuth()
  @UseGuards(PermissionsGuard)
  @Permissions(PermissionTag.ADMIN)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Delete a role by its id, It's for admins" })
  async deleteRole(@Body() roleIdDto: RoleIdDto): Promise<void> {
    return await this.rolesService.deleteRole(roleIdDto);
  }
}
