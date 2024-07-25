import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';

import { CreateRoleDto } from '../dtos/create-role.dto';
import { RoleService } from '../../application/role.service';
import { AddPermissionsToRoleDto } from '../dtos/add-permissions-to-role.dto';
import { Permissions } from '../../application/decorators/permissions';
import { RolePermission } from '../../role.permissions';

@Controller('roles')
export class RoleController {
  constructor(private readonly rolesService: RoleService) {}

  @Permissions(RolePermission.CreateRole)
  @Post()
  async create(@Body() createRoleDto: CreateRoleDto): Promise<void> {
    await this.rolesService.create(createRoleDto);
  }

  @Permissions(RolePermission.AssignPermissionsToRole)
  @HttpCode(HttpStatus.OK)
  @Post(':roleId/permissions')
  async addPermissionToRole(
    @Param('roleId') roleId: string,
    @Body() dto: AddPermissionsToRoleDto,
  ): Promise<void> {
    await this.rolesService.addPermissionsToRole({
      roleId,
      permissionIds: dto.permissionIds,
    });
  }
}
