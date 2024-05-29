import { Repository } from 'typeorm';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

import { IamModule } from '../../../../src/iam/iam.module';
import { CreateRoleDto } from '../../../../src/iam/authorization/presenters/dtos/create-role.dto';
import { RoleName } from '../../../../src/iam/authorization/domain/enums/role-name.enum';
import { OrmRole } from '../../../../src/user/infrastructure/persistance/orm/entities/orm-role.entity';
import { AppModule } from '../../../../src/app.module';

describe('Roles (e2e)', () => {
  let app: INestApplication;
  let roleRepository: Repository<OrmRole>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, IamModule],
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
