import * as request from 'supertest';
import { faker } from '@faker-js/faker';

import { INestApplication } from '@nestjs/common';

import { SignInDto } from '../../src/iam/authentication/dtos/sign-in.dto';
import { Permission } from '../../src/iam/authorization/permission';
import { RoleName } from '../../src/iam/authorization/enums/role-name.enum';
import { PermissionType } from '../../src/iam/authorization/permission.type';
import { RoleRepository } from '../../src/iam/authorization/ports/role.repository';
import { Role } from '../../src/iam/authorization/role';
import { UserService } from '../../src/user/application/user.service';
import { CreateUserInput } from 'src/user/application/inputs/create-user.input';

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
