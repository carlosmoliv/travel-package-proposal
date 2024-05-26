import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsService } from './permissions.service';
import { ExamplePermission } from '../domain/enums/example-permission.enum';
import { PermissionsRepository } from './ports/permissions.repository';
import { mock, MockProxy } from 'jest-mock-extended';
import { Permission } from '../domain/permission';

describe('PermissionsService', () => {
  let sut: PermissionsService;
  let permissionRepository: MockProxy<PermissionsRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsService,
        { provide: PermissionsRepository, useValue: mock() },
      ],
    }).compile();
    sut = module.get<PermissionsService>(PermissionsService);
    permissionRepository = module.get<MockProxy<PermissionsRepository>>(
      PermissionsRepository,
    );
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
});
