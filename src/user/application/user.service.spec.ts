import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';

import { UserService } from './user.service';
import { UserRepository } from './ports/user.repository';
import { mock, MockProxy } from 'jest-mock-extended';
import { UserFactory } from '../domain/factories/user.factory';
import { NotFoundException } from '@nestjs/common';
import { ExamplePermission } from '../../iam/authorization/example-permission.enum';

describe('UserService', () => {
  let sut: UserService;
  let userRepository: MockProxy<UserRepository>;
  let userFactory: MockProxy<UserFactory>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mock(),
        },
        UserFactory,
      ],
    }).compile();
    userRepository = module.get<MockProxy<UserRepository>>(UserRepository);
    userFactory = module.get<MockProxy<UserFactory>>(UserFactory);
    sut = module.get<UserService>(UserService);
  });

  describe('getById()', () => {
    test('Return a User that matches with the provided id', async () => {
      const user = userFactory.create(
        faker.person.firstName(),
        faker.internet.email(),
        'any_id',
      );
      userRepository.findByCriteria.mockResolvedValueOnce(user);

      const result = await sut.getById('any_id');

      expect(result).toEqual(user);
    });

    test('Fails when User does not exists', async () => {
      userRepository.findByCriteria.mockResolvedValueOnce(undefined);

      const promise = sut.getById('any_id');

      await expect(promise).rejects.toThrow(NotFoundException);
    });
  });

  describe('getPermissions()', () => {
    test('Return the User permissions', async () => {
      const user = userFactory.create(
        faker.person.firstName(),
        faker.internet.email(),
        'any_id',
      );
      userRepository.findByCriteria.mockResolvedValueOnce(user);

      const userPermissions = await sut.getPermissions('any_id');

      expect(userPermissions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: ExamplePermission.CanCreateResource,
          }),
          expect.objectContaining({
            type: ExamplePermission.CanUpdateResource,
          }),
        ]),
      );
    });

    test('Fails when User does not exists', async () => {
      userRepository.findByCriteria.mockResolvedValueOnce(undefined);

      const promise = sut.getPermissions('any_id');

      await expect(promise).rejects.toThrow(NotFoundException);
    });
  });
});
