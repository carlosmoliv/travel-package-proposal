import { mock, MockProxy } from 'jest-mock-extended';
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthenticationService } from './authentication.service';
import { UserRepository } from '../../../user/application/ports/user.repository';
import { HashingService } from '../../ports/hashing.service';
import { SignUpInput } from './inputs/sign-up.input';
import { UserFactory } from '../../../user/domain/factories/user.factory';
import { SignInInput } from './inputs/sign-in.input';
import { TokenService } from '../../ports/token.service';
import iamConfig from '../../iam.config';
import { RefreshTokenIdsStorage } from '../infrastructure/refresh-token-ids/refresh-token-ids.storage';
import { RefreshTokenPayload } from './inputs/refresh-token.input';

const mockRefreshTokenIdsStorage = {
  insert: jest.fn(),
  validate: jest.fn(),
  invalidate: jest.fn(),
};

describe('AuthenticationService', () => {
  let sut: AuthenticationService;
  let userRepository: MockProxy<UserRepository>;
  let hashingService: MockProxy<HashingService>;
  let tokenService: MockProxy<TokenService>;
  let userFactory: UserFactory;
  let refreshTokenIdsStorage: jest.Mocked<RefreshTokenIdsStorage>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({}), ConfigModule.forFeature(iamConfig)],
      providers: [
        AuthenticationService,
        UserFactory,
        { provide: UserRepository, useValue: mock() },
        { provide: HashingService, useValue: mock() },
        { provide: TokenService, useValue: mock() },
        {
          provide: RefreshTokenIdsStorage,
          useValue: mockRefreshTokenIdsStorage,
        },
      ],
    }).compile();
    sut = module.get<AuthenticationService>(AuthenticationService);
    userRepository = module.get<MockProxy<UserRepository>>(UserRepository);
    hashingService = module.get<MockProxy<HashingService>>(HashingService);
    tokenService = module.get<MockProxy<TokenService>>(TokenService);
    userFactory = module.get<UserFactory>(UserFactory);
    refreshTokenIdsStorage = module.get(RefreshTokenIdsStorage);
  });

  describe('signUp()', () => {
    let payload: SignUpInput;

    beforeEach(() => {
      payload = {
        email: faker.internet.email(),
        password: faker.internet.password(),
        name: faker.person.fullName(),
      };
    });

    test('Registration of a new user', async () => {
      // Arrange
      userRepository.findByEmail.mockResolvedValueOnce(undefined);
      hashingService.hash.mockResolvedValueOnce('hashed_password');

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
      userRepository.findByEmail.mockResolvedValueOnce(
        userFactory.create('any_name', payload.email, payload.password),
      );
      hashingService.hash.mockResolvedValueOnce('hashed_password');

      // Act and Assert
      await expect(sut.signUp(payload)).rejects.toThrow(ConflictException);
    });
  });

  describe('signIn()', () => {
    let payload: SignInInput;

    beforeEach(() => {
      payload = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };
    });

    test('Authenticate User returning the accessToken and refreshToken', async () => {
      // Arrange
      const user = userFactory.create(
        'any_id',
        'any_name',
        payload.email,
        'hashed_password',
      );
      userRepository.findByEmail.mockResolvedValueOnce(user);
      hashingService.compare.mockResolvedValueOnce(true);
      tokenService.generate.mockResolvedValueOnce('generated_access_token');
      tokenService.generate.mockResolvedValueOnce('generated_refresh_token');
      refreshTokenIdsStorage.insert.mockResolvedValueOnce();

      // Act
      const tokens = await sut.signIn(payload);

      // Assert
      expect(tokens).toEqual({
        accessToken: 'generated_access_token',
        refreshToken: 'generated_refresh_token',
      });
      expect(refreshTokenIdsStorage.insert).toHaveBeenCalled();
      expect(tokenService.generate).toHaveBeenCalledWith(
        {
          userId: user.id,
          email: user.email,
          roles: user.roles,
        },
        expect.any(Number),
      );
    });

    test('Returns unauthorized exception when an invalid password is provided', async () => {
      // Arrange
      userRepository.findByEmail.mockResolvedValueOnce(
        userFactory.create(
          'any_id',
          'any_name',
          payload.email,
          'hashed_password',
        ),
      );
      hashingService.compare.mockResolvedValueOnce(false);

      // Assert
      await expect(sut.signIn(payload)).rejects.toThrow(UnauthorizedException);
    });

    test('Returns unauthorized exception when User does not exists', async () => {
      // Arrange
      userRepository.findByEmail.mockResolvedValueOnce(undefined);

      // Act and Assert
      await expect(sut.signIn(payload)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refreshTokens()', () => {
    test('Regenerate tokens when refresh token provided is valid', async () => {
      const payload: RefreshTokenPayload = { refreshToken: 'refresh_token' };
      userRepository.findById.mockResolvedValueOnce(
        userFactory.create(
          'any_id',
          'any_email@email.com',
          'hashed_password',
          'any_id',
        ),
      );
      tokenService.validateAndDecode.mockResolvedValueOnce({
        userId: 'any_id',
        refreshTokenId: 'refresh_token_id',
      });
      refreshTokenIdsStorage.validate.mockResolvedValueOnce();
      tokenService.generate.mockResolvedValueOnce('regenerated_access_token');
      tokenService.generate.mockResolvedValueOnce('regenerated_refresh_token');

      const regeneratedTokens = await sut.refreshTokens(payload);

      expect(regeneratedTokens).toEqual({
        accessToken: 'regenerated_access_token',
        refreshToken: 'regenerated_refresh_token',
      });
    });

    test('Throw unauthorized when user is not found', async () => {
      const payload: RefreshTokenPayload = { refreshToken: 'refresh_token' };
      tokenService.validateAndDecode.mockResolvedValueOnce({
        userId: 'any_id',
        refreshTokenId: 'refresh_token_id',
      });
      userRepository.findById.mockResolvedValueOnce(undefined);

      await expect(sut.refreshTokens(payload)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    test('Throw Unauthorized when TokenService throws an exception', async () => {
      const payload: RefreshTokenPayload = { refreshToken: 'refresh_token' };
      tokenService.validateAndDecode.mockRejectedValueOnce(new Error());
      userRepository.findById.mockResolvedValueOnce(
        userFactory.create(
          'any_id',
          'any_email@email.com',
          'hashed_password',
          'any_id',
        ),
      );
      const regeneratedTokens = sut.refreshTokens(payload);

      await expect(regeneratedTokens).rejects.toThrow(UnauthorizedException);
    });

    test('', async () => {
      const payload: RefreshTokenPayload = { refreshToken: 'refresh_token' };
      userRepository.findById.mockResolvedValueOnce(
        userFactory.create(
          'any_id',
          'any_email@email.com',
          'hashed_password',
          'any_id',
        ),
      );
      tokenService.validateAndDecode.mockResolvedValueOnce({
        userId: 'any_id',
        refreshTokenId: 'refresh_token_id',
      });
      refreshTokenIdsStorage.validate.mockRejectedValueOnce(
        UnauthorizedException,
      );

      await expect(sut.refreshTokens(payload)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
