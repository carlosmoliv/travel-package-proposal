import { MockProxy, mock } from 'jest-mock-extended';

import { Test, TestingModule } from '@nestjs/testing';

import { RolesService } from './roles.service';
import { RolesRepository } from './ports/rolesRepository';
import { Role } from '../../user/domain/role';
import { RoleName } from '../../user/role-name.enum';

describe('RolesService', () => {
  let sut: RolesService;
  let rolesRepository: MockProxy<RolesRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: RolesRepository,
          useValue: mock(),
        },
      ],
    }).compile();

    sut = module.get<RolesService>(RolesService);
    rolesRepository = module.get<MockProxy<RolesRepository>>(RolesRepository);
  });

  describe('getUserRoles()', () => {
    test('Return roles from the specified user', async () => {
      const role = new Role(RoleName.Client, 'any description');
      rolesRepository.findRolesByUserId.mockResolvedValueOnce([role]);

      const userRoles = await sut.getUserRoles('any_id');

      expect(userRoles).toEqual([role]);
    });
  });
});
