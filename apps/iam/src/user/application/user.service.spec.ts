import { mock, MockProxy } from 'jest-mock-extended';
import { faker } from '@faker-js/faker';

import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

import { UserService } from './user.service';
import { UserRepository } from './ports/user.repository';
import { UserFactory } from '../domain/factories/user.factory';
import { CreateUserInput } from './inputs/create-user.input';
import { AssignRolesToUserInput } from './inputs/assign-roles-to-user.input';
import { PermissionService } from '../../authorization/permission/application/permission.service';
import { RoleService } from '../../authorization/role/application/role.service';
import { HashingService } from '../../shared/hashing/hashing.service';
import { User } from '../domain/user';
import { Permission } from '../../authorization/permission/domain/permission';
import { Role } from '../../authorization/role/domain/role';
import { RoleName } from '../../authorization/role/domain/enums/role-name.enum';
import { ExamplePermission } from '@app/common/iam/enums/example-permission.enum';

describe('UserService', () => {
  let sut: UserService;
  let userRepository: MockProxy<UserRepository>;
  let permissionsService: MockProxy<PermissionService>;
  let rolesService: MockProxy<RoleService>;
  let userFactory: MockProxy<UserFactory>;
  let hashingService: MockProxy<HashingService>;
  let user: User;

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
        {
          provide: HashingService,
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
    hashingService = module.get<MockProxy<HashingService>>(HashingService);
    sut = module.get<UserService>(UserService);

    user = userFactory.create(
      faker.person.firstName(),
      faker.internet.email(),
      'hashed_password',
      'any_id',
    );
  });

  describe('findById()', () => {
    test('Return a User that matches with the provided id', async () => {
      userRepository.findById.mockResolvedValueOnce(user);

      const result = await sut.findById('any_id');

      expect(result).toEqual(user);
    });

    test('Fails when User does not exists', async () => {
      userRepository.findById.mockResolvedValueOnce(undefined);

      const promise = sut.findById('any_id');

      await expect(promise).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByEmail()', () => {
    test('Return a User that matches with the provided email', async () => {
      userRepository.findByEmail.mockResolvedValueOnce(user);

      const result = await sut.findByEmail(user.email);

      expect(result).toEqual(user);
    });

    test('Fails when User does not exists', async () => {
      userRepository.findById.mockResolvedValueOnce(undefined);

      const promise = sut.findByEmail('any_email@email.com');

      await expect(promise).rejects.toThrow(NotFoundException);
    });
  });

  describe('getPermissionsTypes()', () => {
    test('Return the User permissions', async () => {
      const permissions = [
        new Permission(ExamplePermission.CanCreateResource),
        new Permission(ExamplePermission.CanUpdateResource),
      ];
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

  describe('assignRolesToUser()', () => {
    let roles: Role[];

    beforeEach(() => {
      roles = [
        new Role(RoleName.Admin, 'any_description'),
        new Role(RoleName.TravelAgent, 'any_description'),
      ];
    });

    test('Attach a set of Roles to a User', async () => {
      const assignRolesToUser: AssignRolesToUserInput = {
        roleNames: [RoleName.TravelAgent],
        userId: 'any_user_id',
      };
      userRepository.findById.mockResolvedValueOnce(user);
      rolesService.findByIds.mockResolvedValueOnce(roles);
      user.roles = roles;

      await sut.assignRolesToUser(assignRolesToUser);

      expect(userRepository.save).toHaveBeenCalledWith(user);
    });
  });

  describe('create()', () => {
    test('Creation of a new user', async () => {
      // Arrange
      const roleNames = [RoleName.Client, RoleName.TravelAgent];
      const createUserInput: CreateUserInput = {
        name: user.name,
        email: user.email,
        password: '123456',
        roleNames,
      };
      hashingService.hash.mockResolvedValueOnce('hashed_password');
      rolesService.findByNames.mockResolvedValueOnce([
        new Role(RoleName.Client),
        new Role(RoleName.TravelAgent),
      ]);
      userRepository.save.mockResolvedValue();

      // Act
      await sut.create(createUserInput);

      // Assert
      expect(userRepository.save).toHaveBeenCalledWith({
        name: user.name,
        email: user.email,
        id: expect.any(String),
        password: 'hashed_password',
        roles: [new Role(RoleName.Client), new Role(RoleName.TravelAgent)],
      });
    });

    test('Assign default "Client" role to new users when no specific role is provided', async () => {
      // Arrange
      const createUserInput: CreateUserInput = {
        name: user.name,
        email: user.email,
        password: '123456',
      };
      hashingService.hash.mockResolvedValueOnce('hashed_password');
      rolesService.findByNames.mockResolvedValueOnce([
        new Role(RoleName.Client),
      ]);
      userRepository.save.mockResolvedValue();

      // Act
      await sut.create(createUserInput);

      // Assert
      expect(userRepository.save).toHaveBeenCalledWith({
        ...createUserInput,
        id: expect.any(String),
        password: 'hashed_password',
        roles: [new Role(RoleName.Client)],
      });
    });
  });

  describe('verifyUserCredentials()', () => {
    let email: string;
    let password: string;
    let user: User;

    beforeEach(() => {
      email = faker.internet.email();
      password = faker.internet.password();
      user = userFactory.create('any_id', 'any_name', email, 'hashed_password');
    });

    test('Returns the user when credentials are valid', async () => {
      userRepository.findByEmail.mockResolvedValueOnce(user);
      hashingService.compare.mockResolvedValueOnce(true);

      const result = await sut.verifyUserCredentials(email, password);

      expect(result).toEqual(user);
    });

    test('Throws UnauthorizedException when password does not match', async () => {
      userRepository.findByEmail.mockResolvedValueOnce(user);
      hashingService.compare.mockResolvedValueOnce(false);

      await expect(sut.verifyUserCredentials(email, password)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
