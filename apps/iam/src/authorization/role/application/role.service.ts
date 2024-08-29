import { Injectable } from '@nestjs/common';

import { Role } from '@app/iam-lib/authorization/role';
import { RoleRepository } from '@app/iam-lib/authorization/ports/role.repository';
import { CreateRoleInput } from '../inputs/create-role.input';
import { AddPermissionsToRoleInput } from '../inputs/add-permissions-to-role.input';
import { PermissionService } from '../../permission/application/permission.service';
import { RoleName } from '@app/iam-lib/authorization/enums/role-name.enum';

@Injectable()
export class RoleService {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly permissionsService: PermissionService,
  ) {}

  async create(input: CreateRoleInput): Promise<Role> {
    const role = new Role(input.name);
    role.description = input.description;
    return this.roleRepository.save(role);
  }

  async assignPermissionsToRole(
    input: AddPermissionsToRoleInput,
  ): Promise<void> {
    const { roleId, permissionIds } = input;
    const role = await this.roleRepository.findById(roleId);
    role.permissions = await this.permissionsService.findByIds(permissionIds);
    await this.roleRepository.save(role);
  }

  async findByIds(roleIds: string[]): Promise<Role[]> {
    return this.roleRepository.findByIds(roleIds);
  }

  async findByNames(roleNames: RoleName[]): Promise<Role[]> {
    const roles = await this.roleRepository.findByNames(roleNames);
    if (roles.length !== roleNames.length) {
      throw new Error('Some roles could not be found.');
    }
    return roles;
  }
}
