import * as request from 'supertest';
import { DataSource } from 'typeorm';

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrmHelper } from '../helpers/orm.helper';
import { OrmUser } from '../../src/user/infrastructure/persistance/orm/entities/orm-user.entity';
import { OrmRole } from '../../src/iam/authorization/orm/entities/orm-role.entity';
import { RoleName } from '../../src/iam/authorization/enums/role-name.enum';

import { AuthHelper } from '../helpers/auth.helper';
import { OrmPermission } from '../../src/iam/authorization/orm/entities/orm-permission.entity';
import { TravelPackageModule } from '../../src/travel-package/travel-package.module';
import { TravelPackagePermission } from '../../src/travel-package/travel-package.permissions';
import { CreateTravelPackageDto } from '../../src/travel-package/presenters/dtos/create-travel-package.dto';
import { ProposalModule } from '../../src/proposal/proposal.module';
import { ClientModule } from '../../src/client/client.module';
import { UserModule } from '../../src/user/user.module';
import { OrmTravelPackage } from '../../src/travel-package/infrastructure/persistence/orm/entities/orm-travel-package.entity';

describe('Travel Package (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

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
        ClientModule,
        ProposalModule,
        TravelPackageModule,
      ],
    }).compile();
    app = moduleFixture.createNestApplication();

    await app.init();

    const dataSource = app.get<DataSource>(DataSource);
    await OrmHelper.clearTables(dataSource, [OrmUser, OrmRole, OrmPermission]);
    const authUser = await new AuthHelper(app).createAuthenticatedUser(
      RoleName.Admin,
      [TravelPackagePermission.CreateTravelPackage],
    );
    accessToken = authUser.accessToken;
  });

  afterAll(() => {
    app.close();
  });

  describe('POST /travel-packages', () => {
    test('Return the current active user info', async () => {
      const createTravelPackageDto: CreateTravelPackageDto = {
        name: 'Beach Paradise',
        description: 'A relaxing beach getaway',
        destination: 'Hawaii',
        duration: 7,
        price: 999.99,
        imageUrl: 'https://example.com/image.jpg',
      };

      const { status } = await request(app.getHttpServer())
        .post('/travel-packages')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createTravelPackageDto);

      expect(status).toEqual(201);
      const travelPackage = await app
        .get<DataSource>(DataSource)
        .getRepository(OrmTravelPackage)
        .findOne({
          where: {
            name: createTravelPackageDto.name,
            destination: createTravelPackageDto.destination,
          },
        });
      travelPackage.price = parseFloat(
        travelPackage.price as unknown as string,
      );
      expect(travelPackage).toMatchObject(createTravelPackageDto);
    });
  });
});
