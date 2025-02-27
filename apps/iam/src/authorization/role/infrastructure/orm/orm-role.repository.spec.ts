import { In, Repository } from 'typeorm';

import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { OrmRoleRepository } from './orm-role.repository';
import { RoleEntity } from './role.entity';
import { Role } from '../../domain/role';
import { RoleName } from '../../domain/enums/role-name.enum';

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
          provide: getRepositoryToken(RoleEntity),
          useValue: createMockRepository(),
        },
      ],
    }).compile();
    sut = module.get<OrmRoleRepository>(OrmRoleRepository);
    typeOrmRepository = module.get<MockRepository>(
      getRepositoryToken(RoleEntity),
    );
  });

  describe('save()', () => {
    test('Persist a Role on database', async () => {
      const role = new Role(RoleName.Client);
      role.name = RoleName.Admin;
      typeOrmRepository.save.mockResolvedValueOnce(RoleEntity);

      await sut.save(role);

      expect(typeOrmRepository.save).toHaveBeenCalled();
    });
  });

  describe('findByNames()', () => {
    it('Return roles by their names', async () => {
      const roleNames = [RoleName.Admin, RoleName.Client];
      const ormRoles = [
        { id: '1', name: RoleName.Admin } as RoleEntity,
        { id: '2', name: RoleName.Client } as RoleEntity,
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
      const ormRoles: RoleEntity[] = [];

      typeOrmRepository.find.mockResolvedValueOnce(ormRoles);

      const result = await sut.findByNames(roleNames);

      expect(typeOrmRepository.find).toHaveBeenCalledWith({
        where: { name: In(roleNames) },
      });
      expect(result).toEqual(ormRoles);
    });
  });
});
