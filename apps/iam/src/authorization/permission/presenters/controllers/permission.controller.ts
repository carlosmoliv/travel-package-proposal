import { Body, Controller, Post } from '@nestjs/common';

import { Public } from '@app/common/iam/decorators/public.decorator';
import { PermissionService } from '../../application/permission.service';
import { CreatePermissionDto } from '../dtos/create-permission.dto';
import { MessagePattern } from '@nestjs/microservices';
import { PermissionType } from '@app/common/iam/permission.type';

@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Public()
  @Post()
  async create(
    @Body() createPermissionDto: CreatePermissionDto,
  ): Promise<void> {
    await this.permissionService.create(createPermissionDto);
  }

  @MessagePattern('user.hasPermissions')
  async userHasPermissions({
    userId,
    requiredPermissions,
  }: {
    userId: string;
    requiredPermissions: PermissionType[];
  }): Promise<boolean> {
    return this.permissionService.userHasPermissions(
      userId,
      requiredPermissions,
    );
  }
}
