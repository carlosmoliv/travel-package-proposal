import { Injectable } from '@nestjs/common';

import { PermissionRepository } from './ports/permission.repository';
import { Permission } from '../domain/permission';
import { CreatePermissionInput } from './inputs/create-permission.input';

@Injectable()
export class PermissionService {
  constructor(private readonly permissionsRepository: PermissionRepository) {}

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
