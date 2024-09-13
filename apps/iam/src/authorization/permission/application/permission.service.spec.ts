import { mock, MockProxy } from 'jest-mock-extended';

import { Test, TestingModule } from '@nestjs/testing';

import { Permission } from '../domain/permission';
import { PermissionService } from './permission.service';
import { ExamplePermission } from '@app/common/iam/enums/example-permission.enum';
import { PermissionRepository } from './ports/permission.repository';
import { CreatePermissionInput } from './inputs/create-permission.input';

describe('PermissionsService', () => {
  let sut: PermissionService;
  let permissionRepository: MockProxy<PermissionRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionService,
        {
          provide: PermissionRepository,
          useValue: mock(),
        },
      ],
    }).compile();
    sut = module.get<PermissionService>(PermissionService);
    permissionRepository =
      module.get<MockProxy<PermissionRepository>>(PermissionRepository);
  });

  describe('getRolesPermissions()', () => {
    it('Return all permissions related to the provided Role.', async () => {
      const rolesId = ['any_id'];
      const permissions = [
        new Permission(ExamplePermission.CanUpdateResource, 'any description'),
        new Permission(ExamplePermission.CanCreateResource, 'any description'),
      ];
      permissionRepository.findByRoles.mockResolvedValueOnce(permissions);

      const result = await sut.getByRoles(rolesId);

      expect(result).toEqual(expect.arrayContaining(permissions));
    });
  });

  describe('create()', () => {
    test('Create a role', async () => {
      const createPermissionInput: CreatePermissionInput = {
        type: ExamplePermission.CanCreateResource,
        description: 'any description',
      };
      permissionRepository.save.mockResolvedValueOnce();

      await sut.create(createPermissionInput);

      expect(permissionRepository.save).toHaveBeenCalled();
    });
  });

  describe('findByIds()', () => {
    it('Return all permissions from the provided Ids', async () => {
      const permissionIds = ['any_id_1', 'any_id_2', 'any_id_3'];
      const permissions = [
        new Permission(ExamplePermission.CanUpdateResource, 'any description'),
        new Permission(ExamplePermission.CanDeleteResource, 'any description'),
        new Permission(ExamplePermission.CanCreateResource, 'any description'),
      ];
      permissionRepository.findByIds.mockResolvedValueOnce(permissions);

      const result = await sut.findByIds(permissionIds);

      expect(result).toEqual(expect.arrayContaining(permissions));
    });
  });
});
