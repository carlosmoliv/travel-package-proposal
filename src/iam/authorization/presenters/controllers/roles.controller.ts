import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';

import { CreateRoleDto } from '../dtos/create-role.dto';
import { RolesService } from '../../application/roles.service';
import { Public } from '../../../authentication/application/decorators/public.decorator';
import { AddPermissionsToRoleDto } from '../dtos/add-permissions-to-role.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

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
    await this.rolesService.addPermissionToRole({
      roleId,
      permissionIds: dto.permissionIds,
    });
  }
}
