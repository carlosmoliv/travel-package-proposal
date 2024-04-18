import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';

import { IamModule } from '../../../src/iam/iam.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../../../src/user/application/ports/user.repository';
import { SignUpDto } from '../../../src/iam/authentication/dtos/sign-up.dto';
import { faker } from '@faker-js/faker';

describe('Authentication (e2e)', () => {
  let app: INestApplication;
  let userRepository: UserRepository;

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
        IamModule,
      ],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
    userRepository = moduleFixture.get<UserRepository>(UserRepository);
  });

  afterAll(() => {
    app.close();
  });

  describe('POST /authentication/sign-up', () => {
    test('Sign up a User successfully', async () => {
      const password = faker.internet.password();
      const dto: SignUpDto = {
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password,
        confirmPassword: password,
      };

      const { statusCode } = await request(app.getHttpServer())
        .post('/authentication/sign-up')
        .send(dto);

      expect(statusCode).toBe(HttpStatus.CREATED);
      const userExists = await userRepository.findByCriteria({
        email: dto.email,
      });
      expect(userExists).toBeTruthy();
    });
  });
});
