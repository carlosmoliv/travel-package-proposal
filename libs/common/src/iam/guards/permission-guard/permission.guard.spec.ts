import { faker } from '@faker-js/faker';
import { createMock } from '@golevelup/ts-jest';
import { mock, MockProxy } from 'jest-mock-extended';
import { of, lastValueFrom } from 'rxjs';

import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ClientProxy } from '@nestjs/microservices';
import { IAM_SERVICE } from '@app/common/constants';

import { ActiveUserData } from '../../interfaces/active-user-data.interface';
import { PermissionGuard } from './permission.guard';
import { ExamplePermission } from '../../enums/example-permission.enum';
import { PermissionType } from '../../permission.type';

jest.mock('rxjs');

describe('PermissionsGuard', () => {
  let sut: PermissionGuard;
  let reflectorMock: jest.Mocked<Reflector>;
  let iamService: MockProxy<ClientProxy>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionGuard,
        { provide: Reflector, useValue: { getAllAndOverride: jest.fn() } },
        { provide: ClientProxy, useValue: mock() },
        { provide: IAM_SERVICE, useValue: mock() },
      ],
    }).compile();

    reflectorMock = module.get<jest.Mocked<Reflector>>(Reflector);
    iamService = module.get<MockProxy<ClientProxy>>(ClientProxy);
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
      reflectorMock.getAllAndOverride.mockReturnValueOnce(permissionsTypes);
      iamService.send.mockReturnValueOnce(of(true));
      jest.mocked(lastValueFrom).mockResolvedValueOnce(true);

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
