import { Injectable, NotFoundException } from '@nestjs/common';

import { UserRepository } from './ports/user.repository';
import { User } from '../domain/user';
import { RolesService } from '../../iam/authorization/roles.service';
import { PermissionType } from '../../iam/authorization/permission.type';
import { PermissionsService } from '../../iam/authorization/permissions.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly rolesService: RolesService,
    private readonly permissionsService: PermissionsService,
  ) {}

  async getPermissionTypes(userId: string): Promise<PermissionType[]> {
    await this.getById(userId);
    const roles = await this.rolesService.getUserRoles(userId);
    const rolesIds = roles.map((role) => role.id);
    const permissions = await this.permissionsService.getByRoles(rolesIds);
    return permissions.map((permission) => permission.type);
  }

  async getById(id: string): Promise<User> {
    const user = await this.userRepository.findByCriteria({ id });
    if (!user) throw new NotFoundException('User does not exist.');
    return user;
  }
}
