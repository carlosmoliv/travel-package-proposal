import { DataSource, Repository } from 'typeorm';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';

import { IamModule } from '../../../src/iam/iam.module';
import { OrmHelper } from '../../helpers/orm.helper';
import { OrmPermission } from '../../../src/iam/authorization/infrastructure/persistence/orm/entities/orm-permission.entity';
import { ExamplePermission } from '../../../src/iam/authorization/domain/enums/example-permission.enum';
import { CreatePermissionDto } from '../../../src/iam/authorization/presenters/dtos/create-permission.dto';

describe('Permissions (e2e)', () => {
  let app: INestApplication;
  let permissionsRepository: Repository<OrmPermission>;

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
      ],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    const dataSource = app.get<DataSource>(DataSource);
    await OrmHelper.clearTables(dataSource, [OrmPermission]);

    permissionsRepository = moduleFixture.get<Repository<OrmPermission>>(
      getRepositoryToken(OrmPermission),
    );
  });

  afterAll(() => {
    app.close();
  });

  describe('POST /permissions', () => {
    test('Creates a new the Permission', async () => {
      // Arrange
      const createPermissionDto: CreatePermissionDto = {
        type: ExamplePermission.CanCreateResource,
        description: faker.lorem.sentence(),
      };

      // Act
      const { status } = await request(app.getHttpServer())
        .post('/permissions')
        .send(createPermissionDto);

      // Assert
      expect(status).toEqual(201);
      const findRole = await permissionsRepository.findOne({
        where: { type: ExamplePermission.CanCreateResource },
      });
      expect(findRole).toMatchObject(createPermissionDto);
    });
  });
});
