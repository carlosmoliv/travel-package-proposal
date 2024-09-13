import { DataSource, Repository } from 'typeorm';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { OrmPermission } from '../../src/authorization/permission/infrastructure/orm/orm-permission.entity';
import { PermissionModule } from '../../src/authorization/permission/permission.module';
import { OrmHelper } from '@app/common/test/helpers/orm.helper';
import { OrmUser } from '../../src/user/infrastructure/persistance/orm/entities/orm-user.entity';
import { OrmRole } from '../../src/authorization/role/infrastructure/orm/orm-role.entity';
import { CreatePermissionDto } from '../../src/authorization/permission/presenters/dtos/create-permission.dto';
import { ExamplePermission } from '@app/common/iam/enums/example-permission.enum';
import { IamModule } from '../../src/iam.module';
import { UserModule } from '../../src/user/user.module';

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
          logging: false,
        }),
        UserModule,
        PermissionModule,
      ],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    const dataSource = app.get<DataSource>(DataSource);
    await OrmHelper.clearTables(dataSource, [OrmUser, OrmRole, OrmPermission]);

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
