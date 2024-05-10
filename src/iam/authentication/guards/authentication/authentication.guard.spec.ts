import { mock, MockProxy } from 'jest-mock-extended';
import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';

import { AuthenticationGuard } from './authentication.guard';
import { TokenService } from '../../../ports/token.service';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { RoleName } from '../../../../user/role-name.enum';

describe('AuthenticationGuard', () => {
  let sut: AuthenticationGuard;
  let tokenService: MockProxy<TokenService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationGuard,
        { provide: TokenService, useValue: mock() },
      ],
    }).compile();
    sut = module.get<AuthenticationGuard>(AuthenticationGuard);
    tokenService = module.get<MockProxy<TokenService>>(TokenService);
  });

  describe('canActivate()', () => {
    it('should set user property on request if token is valid', async () => {
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

    it('should return Unauthorized for invalid token', async () => {
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

    it('should return Unauthorized if token is missing', async () => {
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
  });
});
