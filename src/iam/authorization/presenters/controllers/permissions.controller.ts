import { Body, Controller, Post } from '@nestjs/common';

import { Public } from '../../../authentication/application/decorators/public.decorator';
import { PermissionsService } from '../../application/permissions.service';
import { CreatePermissionDto } from '../dtos/create-permission.dto';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionService: PermissionsService) {}

  @Public()
  @Post()
  async create(
    @Body() createPermissionDto: CreatePermissionDto,
  ): Promise<void> {
    await this.permissionService.create(createPermissionDto);
  }
}
