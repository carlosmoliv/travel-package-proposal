import { mock, MockProxy } from 'jest-mock-extended';

import { Test, TestingModule } from '@nestjs/testing';

import { RoleService } from './role.service';
import { RoleRepository } from './ports/role.repository';
import { RoleName } from '../domain/enums/role-name.enum';
import { CreateRoleInput } from './inputs/create-role.input';
import { AddPermissionsToRoleInput } from './inputs/add-permissions-to-role.input';
import { Role } from '../domain/role';
import { Permission } from '../domain/permission';
import { ExamplePermission } from '../domain/enums/example-permission.enum';
import { PermissionService } from './permission.service';

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

  describe('addPermissionsToRole()', () => {
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

      await sut.addPermissionsToRole(addPermissionToRole);

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
});
