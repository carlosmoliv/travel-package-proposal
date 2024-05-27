import * as request from 'supertest';
import { faker } from '@faker-js/faker';

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { IamModule } from '../../../../src/iam/iam.module';
import { CreateRoleDto } from '../../../../src/iam/authorization/presenters/dtos/create-role.dto';
import { RoleName } from '../../../../src/iam/authorization/domain/enums/role-name.enum';
import { Repository } from 'typeorm';
import { OrmRole } from '../../../../src/user/infrastructure/persistance/orm/entities/orm-role.entity';

describe('Roles (e2e)', () => {
  let app: INestApplication;
  let roleRepository: Repository<OrmRole>;

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
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    roleRepository = moduleFixture.get<Repository<OrmRole>>(
      getRepositoryToken(OrmRole),
    );
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
      const findRole = await roleRepository.findOne({
        where: { name: RoleName.Admin },
      });
      expect(findRole).toMatchObject(createRoleDto);
    });
  });
});
