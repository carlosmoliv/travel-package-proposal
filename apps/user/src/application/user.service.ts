import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { UserRepository } from './ports/user.repository';
import { CreateUserInput } from './inputs/create-user.input';
import { UserFactory } from '../domain/factories/user.factory';
import { AssignRolesToUserInput } from './inputs/assign-roles-to-user.input';
import { PermissionService } from '@app/iam-lib/authorization/permission.service';
import { RoleService } from '@app/iam-lib/authorization/role.service';
import { HashingService } from '@app/iam-lib/ports/hashing.service';
import { RoleName } from '@app/iam-lib/authorization/enums/role-name.enum';
import { PermissionType } from '@app/iam-lib/authorization/permission.type';
import { User } from '@app/common/domain/user';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly permissionsService: PermissionService,
    private readonly rolesService: RoleService,
    private readonly userFactory: UserFactory,
    private readonly hashingService: HashingService,
  ) {}

  async create({
    name,
    email,
    password,
    roleNames = [RoleName.Client],
  }: CreateUserInput): Promise<void> {
    await this.ensureUserDoesNotExist(email);
    const hashedPassword = await this.hashingService.hash(password);
    const user = this.userFactory.create(name, email, hashedPassword);
    user.roles = await this.rolesService.findByNames(roleNames);
    await this.userRepository.save(user);
  }

  async getPermissionTypes(userId: string): Promise<PermissionType[]> {
    const user = await this.findById(userId);
    const rolesIds = user.roles.map((role) => role.id);
    const permissions = await this.permissionsService.getByRoles(rolesIds);
    return permissions.map((permission) => permission.type);
  }

  async assignRolesToUser({
    userId,
    roleNames,
  }: AssignRolesToUserInput): Promise<void> {
    const user = await this.findById(userId);
    user.roles = await this.rolesService.findByNames(roleNames);
    await this.userRepository.save(user);
  }

  async verifyUserCredentials(email: string, password: string): Promise<User> {
    const user = await this.findByEmail(email);
    const passwordMatch = await this.hashingService.compare(
      password,
      user.password,
    );
    if (!passwordMatch) {
      throw new UnauthorizedException('Password does not match.');
    }
    return user;
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" does not exist.`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with email "${email}" does not exist.`);
    }
    return user;
  }

  private async ensureUserDoesNotExist(email: string): Promise<void> {
    const userExists = await this.userRepository.findByEmail(email);
    if (userExists) {
      throw new ConflictException(`User with email "${email}" already exists.`);
    }
  }
}
