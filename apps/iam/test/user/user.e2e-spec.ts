import * as request from 'supertest';
import { DataSource, Repository } from 'typeorm';
import { faker } from '@faker-js/faker';

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '../../src/user/user.module';
import { OrmUser } from '../../src/user/infrastructure/persistance/orm/entities/orm-user.entity';
import { AssignRolesToUserDto } from '../../src/user/presenters/dtos/assign-roles-to-user.dto';
import { UserFactory } from '../../src/user/domain/factories/user.factory';
import { AuthHelper } from '../helpers/auth.helper';
import { User } from '../../src/user/domain/user';
import { RoleEntity } from '../../src/authorization/role/infrastructure/orm/role.entity';
import { OrmHelper } from '@app/common/test/helpers/orm.helper';
import { OrmPermission } from '../../src/authorization/permission/infrastructure/orm/orm-permission.entity';
import { RoleName } from '../../src/authorization/role/domain/enums/role-name.enum';
import { UserPermission } from '@app/common/iam/enums/user.permissions';
import { Role } from '../../src/authorization/role/domain/role';

describe('User (e2e)', () => {
  let app: INestApplication;
  let roleRepository: Repository<RoleEntity>;
  let userRepository: Repository<OrmUser>;
  let userFactory: UserFactory;
  let dataSource: DataSource;
  let accessToken: string;
  let currentUser: Partial<User>;

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
        UserModule,
      ],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    await app.init();

    dataSource = app.get<DataSource>(DataSource);
    roleRepository = moduleFixture.get<Repository<RoleEntity>>(
      getRepositoryToken(RoleEntity),
    );
    userRepository = moduleFixture.get<Repository<OrmUser>>(
      getRepositoryToken(OrmUser),
    );
    userFactory = moduleFixture.get<UserFactory>(UserFactory);

    await OrmHelper.clearTables(dataSource, [
      OrmUser,
      RoleEntity,
      OrmPermission,
    ]);
    const authUser = await new AuthHelper(app).createAuthenticatedUser(
      RoleName.Admin,
      [UserPermission.AssignRolesToUser],
    );
    accessToken = authUser.accessToken;
    currentUser = authUser.userDetails;
  });

  afterAll(() => {
    app.close();
  });

  describe('GET /users/me', () => {
    test('Return the current active user info', async () => {
      // Act
      const { body, status } = await request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', `Bearer ${accessToken}`);

      // Assert
      expect(status).toEqual(200);
      expect(body.email).toEqual(currentUser.email);
    });
  });

  describe('POST /users/:userId/roles', () => {
    test('Assign a set of Roles to a User', async () => {
      // Arrange
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
        .send({ roleNames: [RoleName.TravelAgent] } as AssignRolesToUserDto);

      // Assert
      expect(status).toEqual(200);
      const findUser = await userRepository.findOne({
        where: { id: user.id },
        relations: ['roles'],
      });
      expect(findUser).toMatchObject({
        roles: expect.arrayContaining([
          expect.objectContaining({ name: RoleName.TravelAgent }),
        ]),
      });
    });
  });
});
