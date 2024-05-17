import { faker } from '@faker-js/faker';
import { createMock } from '@golevelup/ts-jest';
import { mock, MockProxy } from 'jest-mock-extended';

import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

import { ExecutionContext } from '@nestjs/common';
import { ActiveUserData } from '../../interfaces/active-user-data.interface';
import { PermissionsGuard } from './permissions.guard';
import { ExamplePermission } from '../example-permission.enum';
import { UserService } from '../../../user/application/user.service';
import { Permission } from '../permission';

describe('PermissionsGuard', () => {
  let sut: PermissionsGuard;
  let reflectorMock: jest.Mocked<Reflector>;
  let userService: MockProxy<UserService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsGuard,
        { provide: Reflector, useValue: { getAllAndOverride: jest.fn() } },
        { provide: UserService, useValue: mock() },
      ],
    }).compile();
    reflectorMock = module.get<jest.Mocked<Reflector>>(Reflector);
    userService = module.get<MockProxy<UserService>>(UserService);
    sut = module.get<PermissionsGuard>(PermissionsGuard);
  });

  describe('canActivate()', () => {
    let permissions: Permission[];

    beforeAll(async () => {
      permissions = [
        new Permission(ExamplePermission.CanUpdateResource),
        new Permission(ExamplePermission.CanCreateResource),
      ];
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
        ExamplePermission.CanCreateResource,
        ExamplePermission.CanUpdateResource,
      ]);
      userService.getPermissions.mockResolvedValueOnce(permissions);

      // Act
      const result = sut.canActivate(mockExecutionContext);

      // Assert
      expect(result).toBeTruthy();
    });
  });
});
