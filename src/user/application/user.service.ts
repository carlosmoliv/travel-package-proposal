import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './ports/user.repository';
import { User } from '../domain/user';
import { Permission } from '../../iam/authorization/permission';
import { ExamplePermission } from '../../iam/authorization/example-permission.enum';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getById(id: string): Promise<User> {
    const user = await this.userRepository.findByCriteria({ id });
    if (!user) throw new NotFoundException('User does not exist.');
    return user;
  }

  async getPermissions(userId: string): Promise<Permission[]> {
    return [
      new Permission(ExamplePermission.CanUpdateResource),
      new Permission(ExamplePermission.CanCreateResource),
    ];
  }
}
