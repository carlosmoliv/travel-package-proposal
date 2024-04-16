import { OrmUserRepository } from './orm-user.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { UserFactory } from '../../../../domain/factories/user.factory';
import { DataSourceOptions, Repository } from 'typeorm';
import { OrmUser } from '../entities/orm-user.entity';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';

describe('OrmUserRepository', () => {
  let sut: OrmUserRepository;
  let userFactory: UserFactory;
  let userRepository: Repository<OrmUser>;

  const options: DataSourceOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'pass123',
    database: 'travel-package-proposal-db',
    synchronize: true,
    entities: [OrmUser],
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(options),
        TypeOrmModule.forFeature([OrmUser]),
      ],
      providers: [OrmUserRepository, UserFactory],
    }).compile();
    sut = module.get<OrmUserRepository>(OrmUserRepository);
    userFactory = module.get<UserFactory>(UserFactory);
    userRepository = module.get<Repository<OrmUser>>(
      getRepositoryToken(OrmUser),
    );
  });

  describe('save()', () => {
    test('Persist a User on database', async () => {
      const user = userFactory.create('Nobody', 'nobody@email.com', '12345678');

      await sut.save(user);

      const userSaved = await userRepository.findOne({
        where: { email: 'nobody@email.com' },
      });
      expect(userSaved).toBeTruthy();
    });
  });
});
