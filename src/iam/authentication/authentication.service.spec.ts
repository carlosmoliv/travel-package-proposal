import { MockProxy, mock } from 'jest-mock-extended';
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

import { AuthenticationService } from './authentication.service';
import { UserRepository } from '../../user/application/ports/user.repository';
import { HashingService } from '../ports/hashing.service';
import { SignUpPayload } from './payloads/sign-up.payload';
import { UserFactory } from '../../user/domain/factories/user.factory';
import { SignInPayload } from './payloads/sign-in.payload';
import { TokenService } from '../ports/token.service';

describe('AuthenticationService', () => {
  let sut: AuthenticationService;
  let userRepository: MockProxy<UserRepository>;
  let hashingService: MockProxy<HashingService>;
  let tokenService: MockProxy<TokenService>;
  let userFactory: UserFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        UserFactory,
        { provide: UserRepository, useValue: mock() },
        { provide: HashingService, useValue: mock() },
        { provide: TokenService, useValue: mock() },
      ],
    }).compile();
    sut = module.get<AuthenticationService>(AuthenticationService);
    userRepository = module.get<MockProxy<UserRepository>>(UserRepository);
    hashingService = module.get<MockProxy<HashingService>>(HashingService);
    tokenService = module.get<MockProxy<TokenService>>(TokenService);
    userFactory = module.get<UserFactory>(UserFactory);
  });

  describe('signUp()', () => {
    let payload: SignUpPayload;

    beforeEach(() => {
      payload = {
        email: faker.internet.email(),
        password: faker.internet.password(),
        name: faker.person.fullName(),
      };
    });

    test('Registration of a new user', async () => {
      // Arrange
      userRepository.findByCriteria.mockResolvedValue(undefined);
      hashingService.hash.mockResolvedValue('hashed_password');

      // Act
      await sut.signUp(payload);

      // Assert
      expect(userRepository.save).toHaveBeenCalledWith({
        ...payload,
        id: expect.any(String),
        password: 'hashed_password',
      });
    });

    test('Registration throws an exception when the email provided is already in use', async () => {
      // Arrange
      userRepository.findByCriteria.mockResolvedValue(
        userFactory.create('any_name', payload.email, payload.password),
      );
      hashingService.hash.mockResolvedValue('hashed_password');

      // Act and Assert
      await expect(sut.signUp(payload)).rejects.toThrow(ConflictException);
    });
  });

  describe('signIn()', () => {
    let payload: SignInPayload;

    beforeEach(() => {
      payload = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };
    });

    test('Authenticate User and return the accessToken', async () => {
      // Arrange
      userRepository.findByCriteria.mockResolvedValue(
        userFactory.create(
          'any_id',
          'any_name',
          payload.email,
          payload.password,
        ),
      );
      tokenService.generate.mockResolvedValue('generated_token');

      // Act
      const accessToken = await sut.signIn(payload);

      // Assert
      expect(accessToken).toBe('generated_token');
    });

    test('Returns unauthorized exception when an invalid password is provided', async () => {
      // Arrange
      userRepository.findByCriteria.mockResolvedValue(
        userFactory.create(
          'any_id',
          'any_name',
          payload.email,
          'hashed_password',
        ),
      );
      hashingService.compare.mockResolvedValue(false);

      // Assert
      await expect(sut.signIn(payload)).rejects.toThrow(UnauthorizedException);
    });
  });
});
