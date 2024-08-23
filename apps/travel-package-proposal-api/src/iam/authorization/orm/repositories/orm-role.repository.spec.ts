import { In, Repository } from 'typeorm';

import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { OrmRoleRepository } from './orm-role.repository';
import { OrmRole } from '../entities/orm-role.entity';
import { Role } from '../../role';
import { RoleName } from '../../enums/role-name.enum';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
});

describe('OrmRolesRepository', () => {
  let sut: OrmRoleRepository;
  let typeOrmRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        OrmRoleRepository,
        {
          provide: getRepositoryToken(OrmRole),
          useValue: createMockRepository(),
        },
      ],
    }).compile();
    sut = module.get<OrmRoleRepository>(OrmRoleRepository);
    typeOrmRepository = module.get<MockRepository>(getRepositoryToken(OrmRole));
  });

  describe('save()', () => {
    test('Persist a Role on database', async () => {
      const role = new Role(RoleName.Client);
      role.name = RoleName.Admin;
      typeOrmRepository.save.mockResolvedValueOnce(OrmRole);

      await sut.save(role);

      expect(typeOrmRepository.save).toHaveBeenCalled();
    });
  });

  describe('findByNames()', () => {
    it('Return roles by their names', async () => {
      const roleNames = [RoleName.Admin, RoleName.Client];
      const ormRoles = [
        { id: '1', name: RoleName.Admin } as OrmRole,
        { id: '2', name: RoleName.Client } as OrmRole,
      ];
      typeOrmRepository.find.mockResolvedValueOnce(ormRoles);

      const result = await sut.findByNames(roleNames);

      expect(typeOrmRepository.find).toHaveBeenCalledWith({
        where: { name: In(roleNames) },
      });
      expect(result).toEqual(ormRoles);
    });

    it('should return an empty array if no roles are found', async () => {
      const roleNames = [RoleName.Admin, RoleName.Client];
      const ormRoles: OrmRole[] = [];

      typeOrmRepository.find.mockResolvedValueOnce(ormRoles);

      const result = await sut.findByNames(roleNames);

      expect(typeOrmRepository.find).toHaveBeenCalledWith({
        where: { name: In(roleNames) },
      });
      expect(result).toEqual(ormRoles);
    });
  });
});
