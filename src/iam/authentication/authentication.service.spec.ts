import { MockProxy, mock } from 'jest-mock-extended';
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';

import { AuthenticationService } from './authentication.service';
import { UserRepository } from '../../user/application/ports/user.repository';
import { HashingService } from '../ports/hashing.service';
import { SignUpPayload } from './payloads/sign-up.payload';
import { UserFactory } from '../../user/domain/factories/user.factory';

describe('AuthenticationService', () => {
  let sut: AuthenticationService;
  let userRepository: MockProxy<UserRepository>;
  let hashingService: MockProxy<HashingService>;
  let userFactory: UserFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        UserFactory,
        { provide: UserRepository, useValue: mock() },
        { provide: HashingService, useValue: mock() },
      ],
    }).compile();
    sut = module.get<AuthenticationService>(AuthenticationService);
    userRepository = module.get<MockProxy<UserRepository>>(UserRepository);
    hashingService = module.get<MockProxy<HashingService>>(HashingService);
    userFactory = module.get<UserFactory>(UserFactory);
  });

  describe('signUp()', () => {
    test('Registration a new user', async () => {
      // Arrange
      const payload: SignUpPayload = {
        email: faker.internet.email(),
        password: faker.internet.password(),
        name: faker.person.fullName(),
      };
      userRepository.findByCriteria.mockResolvedValue(undefined);
      hashingService.hash.mockResolvedValue('hashedPassword');

      // Act
      await sut.signUp(payload);

      // Assert
      expect(userRepository.save).toHaveBeenCalledWith({
        ...payload,
        password: 'hashedPassword',
      });
    });

    test('Registration fails when the provided email already exists', async () => {
      // Arrange
      const payload: SignUpPayload = {
        email: faker.internet.email(),
        password: faker.internet.password(),
        name: faker.person.fullName(),
      };
      userRepository.findByCriteria.mockResolvedValue(
        userFactory.create(
          faker.person.fullName(),
          payload.email,
          payload.password,
        ),
      );
      hashingService.hash.mockResolvedValue('hashedPassword');

      // Act and Assert
      await expect(sut.signUp(payload)).rejects.toThrow(ConflictException);
    });
  });
});
