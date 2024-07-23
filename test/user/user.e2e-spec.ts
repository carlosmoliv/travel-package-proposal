import * as request from 'supertest';
import { DataSource, Repository } from 'typeorm';
import { faker } from '@faker-js/faker';

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';

import { SignInDto } from '../../src/iam/authentication/presenters/dtos/sign-in.dto';
import { User } from '../../src/user/domain/user';
import { UserModule } from '../../src/user/user.module';
import { IamModule } from '../../src/iam/iam.module';
import { OrmHelper } from '../helpers/orm.helper';
import { OrmUser } from '../../src/user/infrastructure/persistance/orm/entities/orm-user.entity';
import { OrmRole } from '../../src/iam/authorization/infrastructure/persistence/orm/entities/orm-role.entity';
import { Role } from '../../src/iam/authorization/domain/role';
import { RoleName } from '../../src/iam/authorization/domain/enums/role-name.enum';
import { AssignRolesToUserDto } from '../../src/user/presenters/dtos/assign-roles-to-user.dto';
import { UserFactory } from '../../src/user/domain/factories/user.factory';
import { AuthHelper } from '../helpers/auth.helper';
import { UserPermission } from '../../src/user/user.permissions';
import { OrmPermission } from '../../src/iam/authorization/infrastructure/persistence/orm/entities/orm-permission.entity';

describe('User (e2e)', () => {
  let app: INestApplication;
  let roleRepository: Repository<OrmRole>;
  let userRepository: Repository<OrmUser>;
  let userFactory: UserFactory;
  let dataSource: DataSource;
  let authHelper: AuthHelper;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DATABASE_HOST,
          port: +process.env.DATABASE_PORT,
          username: process.env.DATABASE_USER,
          password: process.env.DATABASE_PASSWORD,
          database: process.env.DATABASE_NAME,
          autoLoadEntities: true,
          synchronize: true,
          logging: false,
        }),
        IamModule,
        UserModule,
      ],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    await app.init();

    dataSource = app.get<DataSource>(DataSource);
    roleRepository = moduleFixture.get<Repository<OrmRole>>(
      getRepositoryToken(OrmRole),
    );
    userRepository = moduleFixture.get<Repository<OrmUser>>(
      getRepositoryToken(OrmUser),
    );
    userFactory = moduleFixture.get<UserFactory>(UserFactory);

    authHelper = new AuthHelper(app);
  });

  beforeEach(async () => {
    await OrmHelper.clearTables(dataSource, [OrmUser, OrmRole, OrmPermission]);
  });

  afterAll(() => {
    app.close();
  });

  describe('GET /users/me', () => {
    let signInDto: SignInDto;
    let userData: Partial<User>;

    beforeEach(() => {
      userData = {
        name: faker.person.firstName(),
        email: faker.internet.email(),
      };
      signInDto = {
        email: userData.email,
        password: faker.internet.password({ prefix: '!Aa0' }),
      };
    });

    test('Return the current active user info', async () => {
      // Arrange
      await request(app.getHttpServer())
        .post('/authentication/sign-up')
        .send({
          ...signInDto,
          name: userData.name,
          confirmPassword: signInDto.password,
        });
      const {
        body: { accessToken },
      } = await request(app.getHttpServer())
        .post('/authentication/sign-in')
        .send(signInDto);

      // Act
      const { body, status } = await request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(signInDto);

      // Assert
      expect(status).toEqual(200);
      expect(body).toMatchObject(userData);
    });
  });

  describe('POST /users/:userId/roles', () => {
    let accessToken: string;

    beforeAll(async () => {
      accessToken = await authHelper.getAccessToken(RoleName.Admin, [
        UserPermission.AssignRolesToUser,
      ]);
    });

    test('Assign a set of Roles to a User', async () => {
      // Arrange
      await roleRepository.save(new Role(RoleName.Client));
      await roleRepository.save(new Role(RoleName.TravelAgent));
      const userData = userFactory.create(
        faker.person.firstName(),
        faker.internet.email(),
        faker.internet.password(),
      );
      const user = await userRepository.save(userData);

      // Act
      const { status } = await request(app.getHttpServer())
        .post(`/users/${user.id}/roles`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          roleNames: [RoleName.Client, RoleName.TravelAgent],
        } as AssignRolesToUserDto);

      // Assert
      expect(status).toEqual(200);
      const findUser = await userRepository.findOne({
        where: { id: user.id },
        relations: ['roles'],
      });
      expect(findUser).toMatchObject({
        roles: expect.arrayContaining([
          expect.objectContaining({ name: RoleName.Client }),
          expect.objectContaining({ name: RoleName.TravelAgent }),
        ]),
      });
    });
  });
});
