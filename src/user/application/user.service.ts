import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './ports/user.repository';
import { User } from '../domain/user';
import { ExamplePermission } from '../../iam/authorization/example-permission.enum';
import { RolesService } from '../../iam/authorization/roles.service';
import { NoRolesException } from './exceptions/node-roles.exception';
import { PermissionType } from '../../iam/authorization/permission.type';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly rolesService: RolesService,
  ) {}

  async getPermissions(userId: string): Promise<PermissionType[]> {
    await this.getById(userId);
    const roles = await this.rolesService.getUserRoles(userId);
    if (roles.length === 0) throw new NoRolesException();

    // TODO: Get the user permissions from the PermissionsService
    return [
      ExamplePermission.CanUpdateResource,
      ExamplePermission.CanCreateResource,
    ];
  }

  async getById(id: string): Promise<User> {
    const user = await this.userRepository.findByCriteria({ id });
    if (!user) throw new NotFoundException('User does not exist.');
    return user;
  }
}
