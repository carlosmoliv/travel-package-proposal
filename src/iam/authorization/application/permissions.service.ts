import { Injectable } from '@nestjs/common';

import { PermissionsRepository } from './ports/permissions.repository';
import { Permission } from '../domain/permission';
import { CreatePermissionInput } from './inputs/create-permission.input';

@Injectable()
export class PermissionsService {
  constructor(private readonly permissionsRepository: PermissionsRepository) {}

  async create(permission: CreatePermissionInput): Promise<void> {
    await this.permissionsRepository.save(permission);
  }

  async getByRoles(roleIds: string[]): Promise<Permission[]> {
    return this.permissionsRepository.findByRoles(roleIds);
  }

  async findByIds(permissionIds: string[]): Promise<Permission[]> {
    return this.permissionsRepository.findByIds(permissionIds);
  }
}
