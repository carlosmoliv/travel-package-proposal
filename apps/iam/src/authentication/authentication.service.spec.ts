import { mock, MockProxy } from 'jest-mock-extended';
import { faker } from '@faker-js/faker';

import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { User } from '../user/domain/user';

import { AuthenticationService } from './authentication.service';
import { HashingService } from '../hashing/hashing.service';
import { SignUpInput } from './inputs/sign-up.input';
import { SignInInput } from './inputs/sign-in.input';
import { TokenService } from '../token/token.service';
import { RefreshTokenIdsStorage } from './refresh-token-ids/refresh-token-ids.storage';
import { RefreshTokenInput } from './inputs/refresh-token.input';
import { UserService } from '../user/application/user.service';

const mockRefreshTokenIdsStorage = {
  insert: jest.fn(),
  validate: jest.fn(),
  invalidate: jest.fn(),
};

describe('AuthenticationService', () => {
  let sut: AuthenticationService;
  let hashingService: MockProxy<HashingService>;
  let tokenService: MockProxy<TokenService>;
  let userService: MockProxy<UserService>;
  let refreshTokenIdsStorage: jest.Mocked<RefreshTokenIdsStorage>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({})],
      providers: [
        AuthenticationService,
        { provide: HashingService, useValue: mock() },
        { provide: TokenService, useValue: mock() },
        {
          provide: RefreshTokenIdsStorage,
          useValue: mockRefreshTokenIdsStorage,
        },
        {
          provide: UserService,
          useValue: mock(),
        },
      ],
    }).compile();

    sut = module.get<AuthenticationService>(AuthenticationService);
    userService = module.get<MockProxy<UserService>>(UserService);
    hashingService = module.get<MockProxy<HashingService>>(HashingService);
    tokenService = module.get<MockProxy<TokenService>>(TokenService);
    refreshTokenIdsStorage = module.get(RefreshTokenIdsStorage);
  });

  describe('signUp()', () => {
    let input: SignUpInput;

    beforeEach(() => {
      input = {
        email: faker.internet.email(),
        password: faker.internet.password(),
        name: faker.person.fullName(),
      };
    });

    test('Sign up of a new user', async () => {
      userService.create.mockResolvedValueOnce();

      await sut.signUp(input);

      expect(userService.create).toHaveBeenCalledWith(input);
    });
  });

  describe('signIn()', () => {
    let input: SignInInput;
    let user: User;

    beforeEach(() => {
      input = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };
      user = new User('any_id');
      user.name = 'any_id';
      user.email = input.email;
      user.password = 'hashed_password';
    });

    test('Authenticate User returning the accessToken and refreshToken', async () => {
      // Arrange
      userService.verifyUserCredentials.mockResolvedValueOnce(user);
      hashingService.compare.mockResolvedValueOnce(true);
      tokenService.generate.mockResolvedValueOnce('generated_access_token');
      tokenService.generate.mockResolvedValueOnce('generated_refresh_token');
      refreshTokenIdsStorage.insert.mockResolvedValueOnce();

      // Act
      const tokens = await sut.signIn(input);

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
  });

  describe('refreshTokens()', () => {
    test('Regenerate tokens when refresh token provided is valid', async () => {
      // Arrange
      const payload: RefreshTokenInput = { refreshToken: 'refresh_token' };
      const user = new User('any_id');
      user.name = 'any_name';
      user.email = 'any_email@email.com';
      user.password = 'hashed_password';

      userService.findById.mockResolvedValueOnce(user);
      tokenService.validateAndDecode.mockResolvedValueOnce({
        userId: 'any_id',
        refreshTokenId: 'refresh_token_id',
      });
      refreshTokenIdsStorage.validate.mockResolvedValueOnce();
      tokenService.generate.mockResolvedValueOnce('regenerated_access_token');
      tokenService.generate.mockResolvedValueOnce('regenerated_refresh_token');

      // Act
      const regeneratedTokens = await sut.refreshTokens(payload);

      // Assert
      expect(regeneratedTokens).toEqual({
        accessToken: 'regenerated_access_token',
        refreshToken: 'regenerated_refresh_token',
      });
    });

    test('Throw unauthorized when user is not found', async () => {
      // Arrange
      const payload: RefreshTokenInput = { refreshToken: 'refresh_token' };
      tokenService.validateAndDecode.mockResolvedValueOnce({
        userId: 'any_id',
        refreshTokenId: 'refresh_token_id',
      });
      userService.findById.mockReturnValueOnce(undefined);

      // Act and Assert
      await expect(sut.refreshTokens(payload)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    test('Throw Unauthorized when TokenService throws an exception', async () => {
      // Arrange
      const payload: RefreshTokenInput = { refreshToken: 'refresh_token' };
      tokenService.validateAndDecode.mockRejectedValueOnce(new Error());
      const user = new User('any_id');
      user.name = 'any_name';
      user.email = 'any_email@email.com';
      user.password = 'hashed_password';
      userService.findById.mockResolvedValueOnce(user);
      const regeneratedTokens = sut.refreshTokens(payload);

      // Act and Assert
      await expect(regeneratedTokens).rejects.toThrow(UnauthorizedException);
    });

    test('', async () => {
      const payload: RefreshTokenInput = { refreshToken: 'refresh_token' };
      const user = new User('any_id');
      user.name = 'any_name';
      user.email = 'any_email@email.com';
      user.password = 'hashed_password';
      userService.findById.mockResolvedValueOnce(user);
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
