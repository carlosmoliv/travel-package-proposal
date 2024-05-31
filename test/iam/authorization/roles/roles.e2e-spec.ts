import { DataSource, Repository } from 'typeorm';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';

import { IamModule } from '../../../../src/iam/iam.module';
import { CreateRoleDto } from '../../../../src/iam/authorization/presenters/dtos/create-role.dto';
import { RoleName } from '../../../../src/iam/authorization/domain/enums/role-name.enum';
import { OrmRole } from '../../../../src/iam/authorization/infrastructure/persistence/orm/entities/orm-role.entity';
import { OrmHelper } from '../../../shared/infrastructure/persistence/orm/helpers/orm.helper';
import { OrmUser } from '../../../../src/user/infrastructure/persistance/orm/entities/orm-user.entity';

describe('Roles (e2e)', () => {
  let app: INestApplication;
  let roleRepository: Repository<OrmRole>;

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
    roleRepository = moduleFixture.get<Repository<OrmRole>>(
      getRepositoryToken(OrmRole),
    );
    await app.init();

    const dataSource = app.get<DataSource>(DataSource);
    await OrmHelper.clearTables(dataSource, [OrmRole]);
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
