import { MockProxy, mock } from 'jest-mock-extended';

import { Test, TestingModule } from '@nestjs/testing';

import { RolesService } from './roles.service';
import { RolesRepository } from './ports/roles.repository';
import { Role } from '../../user/domain/role';
import { RoleName } from '../../user/role-name.enum';
import { NoRolesException } from '../../user/application/exceptions/node-roles.exception';

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

  test('RolesService is defined', async () => {
    expect(sut).toBeDefined();
  });
});
