import * as request from 'supertest';

import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SignInDto } from '../../src/iam/authentication/presenters/dtos/sign-in.dto';
import { User } from '../../src/user/domain/user';
import { UserModule } from '../../src/user/user.module';
import { IamModule } from '../../src/iam/iam.module';
import { DataSource } from 'typeorm';
import { OrmHelper } from '../shared/infrastructure/persistence/orm/helpers/orm.helper';
import { OrmUser } from '../../src/user/infrastructure/persistance/orm/entities/orm-user.entity';

describe('User (e2e)', () => {
  let app: INestApplication;

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
        }),
        IamModule,
        UserModule,
      ],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    const dataSource = app.get<DataSource>(DataSource);
    await OrmHelper.clearTables(dataSource, [OrmUser]);
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

    test('Return the current active user data', async () => {
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
});
