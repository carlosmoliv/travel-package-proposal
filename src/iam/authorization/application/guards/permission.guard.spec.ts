import { faker } from '@faker-js/faker';
import { createMock } from '@golevelup/ts-jest';
import { mock, MockProxy } from 'jest-mock-extended';

import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ActiveUserData } from '../../../interfaces/active-user-data.interface';
import { PermissionGuard } from './permission.guard';
import { ExamplePermission } from '../../domain/enums/example-permission.enum';
import { UserService } from '../../../../user/application/user.service';
import { PermissionType } from '../../domain/types/permission.type';

describe('PermissionsGuard', () => {
  let sut: PermissionGuard;
  let reflectorMock: jest.Mocked<Reflector>;
  let userService: MockProxy<UserService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionGuard,
        { provide: Reflector, useValue: { getAllAndOverride: jest.fn() } },
        { provide: UserService, useValue: mock() },
      ],
    }).compile();
    reflectorMock = module.get<jest.Mocked<Reflector>>(Reflector);
    userService = module.get<MockProxy<UserService>>(UserService);
    sut = module.get<PermissionGuard>(PermissionGuard);
  });

  describe('canActivate()', () => {
    let permissionsTypes: PermissionType[];

    beforeAll(async () => {
      permissionsTypes = [
        ExamplePermission.CanCreateResource,
        ExamplePermission.CanUpdateResource,
      ];
    });

    test('Return true if permissions are satisfied', async () => {
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
        ExamplePermission.CanCreateResource,
        ExamplePermission.CanUpdateResource,
      ]);
      userService.getPermissionTypes.mockResolvedValueOnce(permissionsTypes);

      // Act
      const result = await sut.canActivate(mockExecutionContext);

      // Assert
      expect(result).toBe(true);
    });

    test('Return true if there are no context permissions to check', async () => {
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

      // Act
      const result = await sut.canActivate(mockExecutionContext);

      // Assert
      expect(result).toBe(true);
    });
  });
});
