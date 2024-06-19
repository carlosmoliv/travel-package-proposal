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
import { Public } from '../../../authentication/application/decorators/public.decorator';
import { AddPermissionsToRoleDto } from '../dtos/add-permissions-to-role.dto';

@Controller('roles')
export class RoleController {
  constructor(private readonly rolesService: RoleService) {}

  @Public()
  @Post()
  async create(@Body() createRoleDto: CreateRoleDto): Promise<void> {
    await this.rolesService.create(createRoleDto);
  }

  @Public()
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
