import { faker } from '@faker-js/faker';
import { createMock } from '@golevelup/ts-jest';
import { Reflector } from '@nestjs/core';

import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';

import { ActiveUserData } from '../../interfaces/active-user-data.interface';
import { PermissionsGuard } from './permissions.guard';
import { Permission } from '../permission.type';

describe('PermissionsGuard', () => {
  let sut: PermissionsGuard;
  let reflectorMock: jest.Mocked<Reflector>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsGuard,
        { provide: Reflector, useValue: { getAllAndOverride: jest.fn() } },
      ],
    }).compile();
    reflectorMock = module.get<jest.Mocked<Reflector>>(Reflector);
    sut = module.get<PermissionsGuard>(PermissionsGuard);
  });

  test('Return true if permissions are satisfied', () => {
    // Arrange
    const mockRequest = {
      headers: { authorization: 'Bearer valid_token' },
      user: {
        email: faker.internet.email(),
        userId: 'any_id',
      } as ActiveUserData,
    };
    const mockExecutionContext = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    });
    reflectorMock.getAllAndOverride.mockReturnValueOnce([
      Permission.CanCreateResource,
      Permission.CanUpdateResource,
    ]);

    // Act
    const result = sut.canActivate(mockExecutionContext);

    // Assert
    expect(result).toBeTruthy();
  });
});
