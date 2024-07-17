import { Injectable } from '@nestjs/common';

import { Role } from '../domain/role';
import { RoleRepository } from './ports/role.repository';
import { CreateRoleInput } from './inputs/create-role.input';
import { AddPermissionsToRoleInput } from './inputs/add-permissions-to-role.input';
import { PermissionService } from './permission.service';

@Injectable()
export class RoleService {
  constructor(
    private readonly rolesRepository: RoleRepository,
    private readonly permissionsService: PermissionService,
  ) {}

  async create(input: CreateRoleInput): Promise<Role> {
    const role = new Role(input.name);
    role.description = input.description;
    return this.rolesRepository.save(role);
  }

  async addPermissionsToRole(input: AddPermissionsToRoleInput): Promise<void> {
    const { roleId, permissionIds } = input;
    const role = await this.rolesRepository.findById(roleId);
    role.permissions = await this.permissionsService.findByIds(permissionIds);
    await this.rolesRepository.save(role);
  }

  async findByIds(roleIds: string[]): Promise<Role[]> {
    return this.rolesRepository.findByIds(roleIds);
  }
}
