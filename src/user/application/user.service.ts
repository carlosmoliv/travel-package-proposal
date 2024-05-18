import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './ports/user.repository';
import { User } from '../domain/user';
import { Permission } from '../../iam/authorization/permission';
import { ExamplePermission } from '../../iam/authorization/example-permission.enum';
import { RolesService } from '../../iam/authorization/roles.service';
import { NoRolesException } from './exceptions/node-roles.exception';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly rolesService: RolesService,
  ) {}

  async getById(id: string): Promise<User> {
    const user = await this.userRepository.findByCriteria({ id });
    if (!user) throw new NotFoundException('User does not exist.');
    return user;
  }

  async getPermissions(userId: string): Promise<Permission[]> {
    await this.getById(userId);
    const roles = await this.rolesService.getUserRoles(userId);
    if (roles.length === 0) throw new NoRolesException();
    return [
      new Permission(ExamplePermission.CanUpdateResource),
      new Permission(ExamplePermission.CanCreateResource),
    ];
  }
}
