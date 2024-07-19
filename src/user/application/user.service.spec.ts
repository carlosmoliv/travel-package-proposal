import { mock, MockProxy } from 'jest-mock-extended';
import { faker } from '@faker-js/faker';

import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { UserService } from './user.service';
import { UserRepository } from './ports/user.repository';
import { UserFactory } from '../domain/factories/user.factory';
import { ExamplePermission } from '../../iam/authorization/domain/enums/example-permission.enum';
import { RoleService } from '../../iam/authorization/application/role.service';
import { PermissionService } from '../../iam/authorization/application/permission.service';
import { Permission } from '../../iam/authorization/domain/permission';
import { RoleName } from '../../iam/authorization/domain/enums/role-name.enum';
import { Role } from '../../iam/authorization/domain/role';
import { AddRolesToUserInput } from './inputs/add-roles-to-user.input';

describe('UserService', () => {
  let sut: UserService;
  let userRepository: MockProxy<UserRepository>;
  let permissionsService: MockProxy<PermissionService>;
  let rolesService: MockProxy<RoleService>;
  let userFactory: MockProxy<UserFactory>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mock(),
        },
        {
          provide: RoleService,
          useValue: mock(),
        },
        {
          provide: PermissionService,
          useValue: mock(),
        },
        UserFactory,
      ],
    }).compile();
    userRepository = module.get<MockProxy<UserRepository>>(UserRepository);
    userFactory = module.get<MockProxy<UserFactory>>(UserFactory);
    permissionsService =
      module.get<MockProxy<PermissionService>>(PermissionService);
    rolesService = module.get<MockProxy<RoleService>>(RoleService);
    sut = module.get<UserService>(UserService);
  });

  describe('getById()', () => {
    test('Return a User that matches with the provided id', async () => {
      const user = userFactory.create(
        faker.person.firstName(),
        faker.internet.email(),
        'any_id',
      );
      userRepository.findById.mockResolvedValueOnce(user);

      const result = await sut.getById('any_id');

      expect(result).toEqual(user);
    });

    test('Fails when User does not exists', async () => {
      userRepository.findById.mockResolvedValueOnce(undefined);

      const promise = sut.getById('any_id');

      await expect(promise).rejects.toThrow(NotFoundException);
    });
  });

  describe('getPermissionsTypes()', () => {
    test('Return the User permissions', async () => {
      const permissions = [
        new Permission(ExamplePermission.CanCreateResource),
        new Permission(ExamplePermission.CanUpdateResource),
      ];
      const user = userFactory.create(
        faker.person.firstName(),
        faker.internet.email(),
        'any_id',
      );
      user.roles = [new Role(RoleName.Admin)];
      userRepository.findById.mockResolvedValueOnce(user);
      permissionsService.getByRoles.mockResolvedValueOnce(permissions);

      const userPermissions = await sut.getPermissionTypes('any_id');

      expect(userPermissions).toEqual(
        expect.arrayContaining([permissions[0].type, permissions[1].type]),
      );
    });

    test('Fails when User does not exists', async () => {
      userRepository.findById.mockResolvedValueOnce(undefined);

      const promise = sut.getPermissionTypes('any_id');

      await expect(promise).rejects.toThrow(NotFoundException);
    });
  });

  describe('addPermissions()', () => {
    let roles: Role[];

    beforeEach(() => {
      roles = [
        new Role(RoleName.Admin, 'any_description'),
        new Role(RoleName.TravelAgent, 'any_description'),
      ];
    });

    test('Attach a set of Roles to a User', async () => {
      const addRolesToUser: AddRolesToUserInput = {
        roleIds: ['any_role_id_1', 'any_role_id_2'],
        userId: 'any_user_id',
      };
      const user = userFactory.create(
        faker.person.firstName(),
        faker.internet.email(),
        'any_id',
      );
      userRepository.findById.mockResolvedValueOnce(user);
      rolesService.findByIds.mockResolvedValueOnce(roles);
      user.roles = roles;

      await sut.addRolesToUser(addRolesToUser);

      expect(userRepository.save).toHaveBeenCalledWith(user);
    });
  });
});
