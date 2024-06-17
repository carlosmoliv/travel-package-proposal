import { Injectable } from '@nestjs/common';

import { RolesRepository } from './ports/roles.repository';
import { CreateRoleInput } from './inputs/create-role.input';
import { Role } from '../domain/role';
import { AddPermissionToRoleInput } from './inputs/add-role-to-permission.input';
import { PermissionsService } from './permissions.service';

@Injectable()
export class RolesService {
  constructor(
    private readonly rolesRepository: RolesRepository,
    private readonly permissionsService: PermissionsService,
  ) {}

  async create(input: CreateRoleInput): Promise<void> {
    const role = new Role(input.name);
    role.description = input.description;
    return this.rolesRepository.save(role);
  }

  async addPermissionsToRole(input: AddPermissionToRoleInput): Promise<void> {
    const { roleId, permissionIds } = input;
    const role = await this.rolesRepository.findById(roleId);
    role.permissions = await this.permissionsService.findByIds(permissionIds);
    await this.rolesRepository.save(role);
  }
}
