import { mock, MockProxy } from 'jest-mock-extended';
import { createMock } from '@golevelup/ts-jest';

import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

import { AuthenticationGuard } from './authentication.guard';
import { TokenService } from '../../../../ports/token.service';
import { RoleName } from '../../../../authorization/domain/enums/role-name.enum';

describe('AuthenticationGuard', () => {
  let sut: AuthenticationGuard;
  let tokenService: MockProxy<TokenService>;
  let reflectorMock: jest.Mocked<Reflector>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationGuard,
        { provide: TokenService, useValue: mock() },
        { provide: Reflector, useValue: { getAllAndOverride: jest.fn() } },
      ],
    }).compile();
    sut = module.get<AuthenticationGuard>(AuthenticationGuard);
    tokenService = module.get<MockProxy<TokenService>>(TokenService);
    reflectorMock = module.get(Reflector);
  });

  describe('canActivate()', () => {
    test('Set user property on request if token is valid', async () => {
      // Arrange
      const mockRequest = {
        headers: {
          authorization: 'Bearer valid_token',
        },
      };
      const mockExecutionContext = createMock<ExecutionContext>({
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      });
      const user = {
        userId: 1,
        email: 'any@mail.com',
        roles: [
          {
            id: 'role_id_1',
            name: RoleName.Client,
          },
        ],
      };
      tokenService.validateAndDecode.mockResolvedValueOnce(user);

      // Act
      const result = await sut.canActivate(mockExecutionContext);

      // Assert
      expect(result).toBe(true);
      expect(mockExecutionContext.switchToHttp().getRequest()['user']).toEqual(
        user,
      );
    });

    test('Return true for public requests', async () => {
      // Arrange
      const mockRequest = {
        headers: {},
      };
      const mockExecutionContext = createMock<ExecutionContext>({
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      });
      reflectorMock.getAllAndOverride.mockReturnValueOnce(true);

      // Act
      const result = await sut.canActivate(mockExecutionContext);

      // Assert
      expect(result).toBe(true);
    });

    test('Return Unauthorized for invalid token', async () => {
      // Arrange
      const mockRequest = {
        headers: {
          authorization: 'Bearer invalid_token',
        },
      };
      const mockExecutionContext = createMock<ExecutionContext>({
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      });
      tokenService.validateAndDecode.mockRejectedValueOnce(
        new Error('Token service error'),
      );

      // Act
      const promise = sut.canActivate(mockExecutionContext);

      // Assert
      await expect(promise).rejects.toThrow(UnauthorizedException);
    });

    test('Return Unauthorized if token is missing', async () => {
      // Arrange
      const mockRequest = {
        headers: {},
      };
      const mockExecutionContext = createMock<ExecutionContext>({
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      });

      // Act
      const promise = sut.canActivate(mockExecutionContext);

      // Assert
      await expect(promise).rejects.toThrow(UnauthorizedException);
    });

    it('Return Unauthorized for invalid token format', async () => {
      // Arrange
      const mockRequest = {
        headers: {
          authorization: 'invalid_token',
        },
      };
      const mockExecutionContext = createMock<ExecutionContext>({
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      });

      // Act
      const promise = sut.canActivate(mockExecutionContext);

      // Assert
      await expect(promise).rejects.toThrow(UnauthorizedException);
    });
  });
});
