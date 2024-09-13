import * as request from 'supertest';
import { DataSource } from 'typeorm';

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrmHelper } from '@app/common/test/helpers/orm.helper';

import { TravelPackagePermission } from '@app/common/iam/enums/travel-package.permissions.enum';

import { OrmTravelPackage } from '../src/infrastructure/persistence/orm/entities/orm-travel-package.entity';
import { CreateTravelPackageDto } from '../src/presenters/dtos/create-travel-package.dto';
import { TravelPackageModule } from '../src/travel-package.module';
import { AuthHelper } from '../../iam/test/helpers/auth.helper';

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
