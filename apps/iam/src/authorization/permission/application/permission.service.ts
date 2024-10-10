import { Injectable } from '@nestjs/common';

import { PermissionType } from '@app/common/iam/permission.type';

import { PermissionRepository } from './ports/permission.repository';
import { Permission } from '../domain/permission';
import { CreatePermissionInput } from './inputs/create-permission.input';

@Injectable()
export class PermissionService {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  async create(permission: CreatePermissionInput): Promise<void> {
    await this.permissionRepository.save(permission);
  }

  async findByIds(permissionIds: string[]): Promise<Permission[]> {
    return this.permissionRepository.findByIds(permissionIds);
  }

  async userHasPermissions(
    userId: string,
    requiredPermissions: PermissionType[],
  ): Promise<boolean> {
    const userPermissions =
      await this.permissionRepository.findUserPermissions(userId);

    const userPermissionTypes = userPermissions.map(
      (permission) => permission.type,
    );

    return requiredPermissions.every((permission) =>
      userPermissionTypes.includes(permission),
    );
  }
}
