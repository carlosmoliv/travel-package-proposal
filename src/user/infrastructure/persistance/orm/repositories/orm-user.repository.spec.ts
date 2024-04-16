import { OrmUserRepository } from './orm-user.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { UserFactory } from '../../../../domain/factories/user.factory';
import { Repository } from 'typeorm';
import { OrmUser } from '../entities/orm-user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

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
          provide: getRepositoryToken(OrmUser),
          useValue: createMockRepository(),
        },
      ],
    }).compile();
    sut = module.get<OrmUserRepository>(OrmUserRepository);
    userFactory = module.get<UserFactory>(UserFactory);
    typeOrmRepository = module.get<MockRepository>(getRepositoryToken(OrmUser));
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
      const userSaved = await sut.findByCriteria({ email: user.email });
      expect(userSaved).toBeTruthy();
    });
  });

  describe('findByCriteria()', () => {
    test('Return a User that match with the criteria', async () => {
      const email = faker.internet.email();
      const expectedUser = userFactory.create('Nobody', email, '12345678');
      await sut.save(expectedUser);
      typeOrmRepository.findOne.mockReturnValue(expectedUser);

      const user = await sut.findByCriteria({ email });

      expect(user).toEqual(expectedUser);
    });
  });
});
