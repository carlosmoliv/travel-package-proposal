import * as request from 'supertest';

import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { SignInDto } from '../../src/iam/authentication/presenters/dtos/sign-in.dto';
import { User } from '../../src/user/domain/user';
import { UserModule } from '../../src/user/user.module';
import { IamModule } from '../../src/iam/iam.module';

describe('Authentication (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5433,
          username: 'postgres',
          password: 'pass123',
          database: 'travel-package-proposal-db',
          autoLoadEntities: true,
          synchronize: true,
        }),
        ConfigModule.forRoot(),
        IamModule,
        UserModule,
      ],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
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
