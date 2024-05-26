import * as request from 'supertest';
import { faker } from '@faker-js/faker';

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule } from '@nestjs/config';
import { IamModule } from '../../src/iam/iam.module';
import { CreateRoleDto } from '../../src/iam/authorization/dtos/create-role.dto';
import { RoleName } from '../../src/user/role-name.enum';

describe('Roles (e2e)', () => {
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
          dropSchema: true,
        }),
        ConfigModule.forRoot(),
        IamModule,
      ],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(() => {
    app.close();
  });

  describe('POST /roles', () => {
    test('Creates a new the Role', async () => {
      // Arrange
      const createRoleDto: CreateRoleDto = {
        name: RoleName.Admin,
        description: faker.lorem.sentence(),
      };

      // Act
      const { status } = await request(app.getHttpServer())
        .post('/roles')
        .send(createRoleDto);

      // Assert
      expect(status).toEqual(201);
    });
  });
});
