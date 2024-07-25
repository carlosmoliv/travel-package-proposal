import * as request from 'supertest';

import { INestApplication } from '@nestjs/common';

import { SignInDto } from '../../src/iam/authentication/presenters/dtos/sign-in.dto';
import { Permission } from '../../src/iam/authorization/domain/permission';
import { RoleName } from '../../src/iam/authorization/domain/enums/role-name.enum';
import { PermissionType } from '../../src/iam/authorization/domain/types/permission.type';
import { RoleRepository } from '../../src/iam/authorization/application/ports/role.repository';
import { Role } from '../../src/iam/authorization/domain/role';
import { UserService } from '../../src/user/application/user.service';
import { faker } from '@faker-js/faker';
import { CreateUserInput } from 'src/user/application/inputs/create-user.input';

export class AuthHelper {
  private accessToken: string;

  constructor(private readonly app: INestApplication) {}

  async getAccessToken(
    roleName: RoleName,
    permissionTypes: PermissionType[],
  ): Promise<string> {
    if (!this.accessToken) {
      await this.generateAuthenticatedUser(roleName, permissionTypes);
    }
    return this.accessToken;
  }

  private async generateAuthenticatedUser(
    roleName: RoleName,
    permissionTypes: PermissionType[],
  ) {
    const role = await this.createRoleWithPermissions(
      roleName,
      permissionTypes,
    );

    const createUserInput: CreateUserInput = {
      email: faker.internet.email(),
      name: faker.internet.userName(),
      password: faker.internet.password(),
      roleNames: [role.name],
    };

    await this.app.get(UserService).create(createUserInput);

    await this.signIn({
      email: createUserInput.email,
      password: createUserInput.password,
    });
  }

  private async signIn({ email, password }: SignInDto): Promise<void> {
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
