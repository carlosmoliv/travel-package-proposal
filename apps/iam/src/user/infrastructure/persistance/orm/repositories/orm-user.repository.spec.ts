import { Repository } from 'typeorm';

import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';

import { OrmUserRepository } from './orm-user.repository';
import { UserFactory } from '../../../../domain/factories/user.factory';
import { UserEntity } from '../entities/user.entity';
import { RoleName } from '../../../../../authorization/role/domain/enums/role-name.enum';
import { RoleEntity } from '../../../../../authorization/role/infrastructure/orm/role.entity';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

describe('OrmUserRepository', () => {
  let sut: OrmUserRepository;
  let userFactory: UserFactory;
  let typeOrmRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        OrmUserRepository,
        UserFactory,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: createMockRepository(),
        },
      ],
    }).compile();
    sut = module.get<OrmUserRepository>(OrmUserRepository);
    userFactory = module.get<UserFactory>(UserFactory);
    typeOrmRepository = module.get<MockRepository>(
      getRepositoryToken(UserEntity),
    );
  });

  describe('save()', () => {
    test('Persist a User on database', async () => {
      const user = userFactory.create(
        'Nobody',
        faker.internet.email(),
        '12345678',
      );

      await sut.save(user);

      typeOrmRepository.findOne.mockReturnValue(user);
      const userSaved = await sut.findByEmail(user.email);
      expect(userSaved).toBeTruthy();
    });
  });

  describe('findByEmail()', () => {
    test('Returns a User that match with the provided email', async () => {
      const email = faker.internet.email();
      const expectedUser = userFactory.create('Nobody', email, '12345678');
      await sut.save(expectedUser);
      typeOrmRepository.findOne.mockReturnValueOnce(expectedUser);

      const user = await sut.findByEmail(email);

      expect(user).toEqual(expectedUser);
    });
  });

  describe('findById()', () => {
    test('Returns a User that match with the id', async () => {
      // Arrange
      const id = 'any_id_123';
      const ormEntity = new UserEntity();
      ormEntity.name = 'Nobody';
      ormEntity.email = 'any_email@email.com';
      ormEntity.password = '12345678';

      const ormRole = new RoleEntity();
      ormRole.name = RoleName.Client;
      ormRole.description = 'Some description';

      ormEntity.roles = [ormRole];

      typeOrmRepository.findOne.mockReturnValue(ormEntity);

      const user = await sut.findById(id);

      expect(user).toMatchObject({
        name: 'Nobody',
        roles: expect.arrayContaining([
          expect.objectContaining({ name: RoleName.Client }),
        ]),
      });
    });
  });
});
