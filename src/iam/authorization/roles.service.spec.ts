import { mock, MockProxy } from 'jest-mock-extended';

import { Test, TestingModule } from '@nestjs/testing';

import { RolesService } from './roles.service';
import { RolesRepository } from './ports/roles.repository';
import { RoleName } from '../../user/role-name.enum';
import { CreateRoleInput } from './inputs/create-role.input';

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

  describe('create()', () => {
    test('Create a role', async () => {
      const createRoleInput: CreateRoleInput = {
        name: RoleName.Client,
        description: 'any description',
      };
      rolesRepository.save.mockResolvedValueOnce();

      await sut.create(createRoleInput);

      expect(rolesRepository.save).toHaveBeenCalled();
    });
  });
});
