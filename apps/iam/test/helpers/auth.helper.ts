import * as request from 'supertest';
import { faker } from '@faker-js/faker';

import { INestApplication } from '@nestjs/common';

import { CreateUserInput } from '../../src/user/application/inputs/create-user.input';
import { PermissionType } from '../../src/authorization/permission.type';
import { RoleName } from '../../src/authorization/role/domain/enums/role-name.enum';
import { UserService } from '../../src/user/application/user.service';
import { SignInDto } from '../../src/authentication/dtos/sign-in.dto';
import { Role } from '../../src/authorization/role/domain/role';
import { Permission } from '../../src/authorization/permission/domain/permission';
import { RoleRepository } from '../../src/authorization/role/application/ports/role.repository';

export class AuthHelper {
  private accessToken: string;
  private userDetails: CreateUserInput;

  constructor(private readonly app: INestApplication) {}

  async createAuthenticatedUser(
    roleName: RoleName,
    permissionTypes: PermissionType[],
  ): Promise<{ accessToken: string; userDetails: CreateUserInput }> {
    if (!this.accessToken) {
      await this.createUser(roleName, permissionTypes);
      await this.authenticateUser({
        email: this.userDetails.email,
        password: this.userDetails.password,
      });
    }
    return { accessToken: this.accessToken, userDetails: this.userDetails };
  }

  private async createUser(
    roleName: RoleName,
    permissionTypes: PermissionType[],
  ) {
    const role = await this.createRoleWithPermissions(
      roleName,
      permissionTypes,
    );

    this.userDetails = {
      email: faker.internet.email(),
      name: faker.internet.userName(),
      password: faker.internet.password(),
      roleNames: [role.name],
    };

    await this.app.get(UserService).create(this.userDetails);
  }

  private async authenticateUser({
    email,
    password,
  }: SignInDto): Promise<void> {
    const response = await request(this.app.getHttpServer())
      .post('/authentication/sign-in')
      .send({ email, password });
    this.accessToken = response.body.accessToken;
  }

  private async createRoleWithPermissions(
    roleName: RoleName,
    permissionTypes: PermissionType[],
  ): Promise<Role> {
    const permissions = permissionTypes.map(
      (permissionType) => new Permission(permissionType),
    );
    const role = new Role(roleName);
    role.permissions = permissions;
    return await this.app.get<RoleRepository>(RoleRepository).save(role);
  }
}
