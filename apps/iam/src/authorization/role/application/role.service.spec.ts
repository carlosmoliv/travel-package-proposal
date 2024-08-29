import { mock, MockProxy } from 'jest-mock-extended';

import { Test, TestingModule } from '@nestjs/testing';

import { RoleService } from './role.service';
import { RoleRepository } from '@app/iam-lib/authorization/ports/role.repository';
import { CreateRoleInput } from '../inputs/create-role.input';
import { AddPermissionsToRoleInput } from '../inputs/add-permissions-to-role.input';
import { Role } from '@app/iam-lib/authorization/role';
import { Permission } from '@app/iam-lib/authorization/permission';
import { ExamplePermission } from '@app/iam-lib/authorization/enums/example-permission.enum';
import { PermissionService } from '../../permission/application/permission.service';
import { RoleName } from '@app/iam-lib/authorization/enums/role-name.enum';

describe('RolesService', () => {
  let sut: RoleService;
  let rolesRepository: MockProxy<RoleRepository>;
  let permissionsService: MockProxy<PermissionService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: RoleRepository,
          useValue: mock(),
        },
        {
          provide: PermissionService,
          useValue: mock(),
        },
      ],
    }).compile();
    sut = module.get<RoleService>(RoleService);
    rolesRepository = module.get<MockProxy<RoleRepository>>(RoleRepository);
    permissionsService =
      module.get<MockProxy<PermissionService>>(PermissionService);
  });

  describe('create()', () => {
    test('Create a role', async () => {
      const createRoleInput: CreateRoleInput = {
        name: RoleName.Client,
        description: 'any description',
      };
      rolesRepository.save.mockResolvedValueOnce(
        new Role(createRoleInput.name, createRoleInput.description),
      );

      await sut.create(createRoleInput);

      expect(rolesRepository.save).toHaveBeenCalled();
    });
  });

  describe('assignPermissionsToRole()', () => {
    let role: Role;
    let permissions: Permission[];

    beforeEach(() => {
      role = new Role(RoleName.Admin, 'any_description');
      permissions = [
        new Permission(ExamplePermission.CanUpdateResource, 'any description'),
        new Permission(ExamplePermission.CanDeleteResource, 'any description'),
        new Permission(ExamplePermission.CanCreateResource, 'any description'),
      ];
    });

    test('Attach a Permission to a Role', async () => {
      const addPermissionToRole: AddPermissionsToRoleInput = {
        permissionIds: [
          'any_permission_id_1',
          'any_permission_id_2',
          'any_permission_id_3',
        ],
        roleId: 'any_role_id',
      };
      rolesRepository.findById.mockResolvedValueOnce(role);
      permissionsService.findByIds.mockResolvedValueOnce(permissions);
      role.permissions = permissions;

      await sut.assignPermissionsToRole(addPermissionToRole);

      expect(rolesRepository.save).toHaveBeenCalledWith(role);
    });

    describe('findByIds()', () => {
      it('Return all roles from the provided Ids', async () => {
        const roleIds = ['any_id_1', 'any_id_2'];
        const roles = [
          new Role(RoleName.Admin, 'any_description'),
          new Role(RoleName.TravelAgent, 'any_description'),
        ];
        rolesRepository.findByIds.mockResolvedValueOnce(roles);

        const result = await sut.findByIds(roleIds);

        expect(result).toEqual(expect.arrayContaining(roles));
      });
    });
  });

  describe('findByNames()', () => {
    it('Return all roles from the provided names', async () => {
      const roleNames = [RoleName.Admin, RoleName.TravelAgent];
      const roles = [
        new Role(RoleName.Admin, 'Admin description'),
        new Role(RoleName.TravelAgent, 'TravelAgent description'),
      ];
      rolesRepository.findByNames.mockResolvedValueOnce(roles);

      const result = await sut.findByNames(roleNames);

      expect(result).toEqual(expect.arrayContaining(roles));
      expect(rolesRepository.findByNames).toHaveBeenCalledWith(roleNames);
    });

    it('Throws an error if some roles could not be found', async () => {
      const roleNames = [RoleName.Admin, RoleName.TravelAgent];
      const roles = [new Role(RoleName.Admin, 'Admin description')];
      rolesRepository.findByNames.mockResolvedValueOnce(roles);

      await expect(sut.findByNames(roleNames)).rejects.toThrow(
        'Some roles could not be found.',
      );
      expect(rolesRepository.findByNames).toHaveBeenCalledWith(roleNames);
    });
  });
});
