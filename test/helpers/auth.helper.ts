import * as request from 'supertest';

import { INestApplication } from '@nestjs/common';

import { SignUpDto } from '../../src/iam/authentication/presenters/dtos/sign-up.dto';
import { SignInDto } from '../../src/iam/authentication/presenters/dtos/sign-in.dto';
import { Permission } from '../../src/iam/authorization/domain/permission';
import { UserRepository } from '../../src/user/application/ports/user.repository';
import { RoleName } from '../../src/iam/authorization/domain/enums/role-name.enum';
import { PermissionType } from '../../src/iam/authorization/domain/types/permission.type';
import { RoleRepository } from '../../src/iam/authorization/application/ports/role.repository';
import { Role } from '../../src/iam/authorization/domain/role';
import { UserService } from '../../src/user/application/user.service';
import { fakeSignUpDto } from '../fakes/dtos/make-fake-signup-dto';

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
    const signUpDto = fakeSignUpDto();
    await this.signUp(signUpDto);

    const user = await this.app
      .get<UserRepository>(UserRepository)
      .findByCriteria({ email: signUpDto.email });

    const role = await this.createRoleWithPermissions(
      roleName,
      permissionTypes,
    );
    await this.app.get<UserService>(UserService).addRolesToUser({
      userId: user.id,
      roleIds: [role.id],
    });

    await this.signIn({ email: signUpDto.email, password: signUpDto.password });
  }

  private async signIn({ email, password }: SignInDto): Promise<void> {
    const response = await request(this.app.getHttpServer())
      .post('/authentication/sign-in')
      .send({ email, password });
    this.accessToken = response.body.accessToken;
  }

  private async signUp(signUpDto: SignUpDto): Promise<void> {
    await request(this.app.getHttpServer())
      .post('/authentication/sign-up')
      .send(signUpDto);
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
