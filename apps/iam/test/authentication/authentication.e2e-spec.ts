import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';

import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';

import { CacheStorageService } from '@app/common/cache-storage/cache-storage.service';
import { OrmHelper } from '@app/common/test/helpers/orm.helper';
import { OrmRole } from '@app/iam-lib/authorization/orm/entities/orm-role.entity';
import { OrmPermission } from '@app/iam-lib/authorization/orm/entities/orm-permission.entity';
import { RoleService } from '@app/iam-lib/authorization/role.service';
import { RoleName } from '@app/iam-lib/authorization/enums/role-name.enum';

import { SignInDto } from '../../src/authentication/dtos/sign-in.dto';
import { IamModule } from '../../src/iam.module';
import { SignUpDto } from '../../src/authentication/dtos/sign-up.dto';
import { fakeSignUpDto } from '../fakes/dtos/make-fake-signup-dto';
import { OrmUser } from '../../../user/src/infrastructure/persistance/orm/entities/orm-user.entity';
import { RefreshTokenDto } from '../../src/authentication/dtos/refresh-token.dto';

describe('Authentication (e2e)', () => {
  let app: INestApplication;
  let cacheStorageService: CacheStorageService;

  beforeAll(async () => {
    console.log(
      'DATABASE PORT TESTING LOGGING ===>',
      +process.env.DATABASE_PORT,
    );
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
        IamModule,
      ],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    const dataSource = app.get<DataSource>(DataSource);
    await OrmHelper.clearTables(dataSource, [OrmUser, OrmRole, OrmPermission]);

    cacheStorageService =
      moduleFixture.get<CacheStorageService>(CacheStorageService);

    await moduleFixture
      .get<RoleService>(RoleService)
      .create({ name: RoleName.Client });
  });

  afterAll(() => {
    app.close();
  });

  describe('POST /authentication/sign-up', () => {
    let signUpDto: SignUpDto;

    beforeEach(() => {
      signUpDto = fakeSignUpDto();
    });

    test('Sign up a User successfully', async () => {
      const { statusCode } = await request(app.getHttpServer())
        .post('/authentication/sign-up')
        .send(signUpDto);

      expect(statusCode).toBe(HttpStatus.CREATED);
    });

    test('Password and confirm password should match', async () => {
      signUpDto.confirmPassword = faker.internet.password({ prefix: '!Aa0' });
      const { statusCode } = await request(app.getHttpServer())
        .post('/authentication/sign-up')
        .send(signUpDto);

      expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
    });

    test.each(['name', 'email', 'password', 'confirmPassword'])(
      'Invalid %s is not allowed',
      async (field) => {
        // Arrange
        delete signUpDto[field];

        // Act
        const { statusCode } = await request(app.getHttpServer())
          .post('/authentication/sign-up')
          .send(signUpDto);

        // Assert
        expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
      },
    );

    test('User cannot register with an existent email', async () => {
      // Arrange
      await request(app.getHttpServer())
        .post('/authentication/sign-up')
        .send(signUpDto);

      // Act
      const { statusCode } = await request(app.getHttpServer())
        .post('/authentication/sign-up')
        .send(signUpDto);

      // Assert
      expect(statusCode).toBe(HttpStatus.CONFLICT);
    });
  });

  describe('POST /authentication/sign-in', () => {
    let signInDto: SignInDto;

    beforeEach(() => {
      signInDto = {
        email: faker.internet.email(),
        password: faker.internet.password({ prefix: '!Aa0' }),
      };
    });

    test('Sign in a User successfully returning valid access and refresh tokens', async () => {
      await request(app.getHttpServer())
        .post('/authentication/sign-up')
        .send({
          ...signInDto,
          confirmPassword: signInDto.password,
          name: 'any_name',
        });

      const { statusCode, body } = await request(app.getHttpServer())
        .post('/authentication/sign-in')
        .send(signInDto);

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body.accessToken).toBeTruthy();
      expect(body.refreshToken).toBeTruthy();
    });

    test('Sign in a User successfully returning valid tokens and storing the refreshTokenId', async () => {
      await request(app.getHttpServer())
        .post('/authentication/sign-up')
        .send({
          ...signInDto,
          confirmPassword: signInDto.password,
          name: 'any_name',
        });

      await request(app.getHttpServer())
        .post('/authentication/sign-in')
        .send(signInDto);

      // const user = await userRepository.findByEmail(signInDto.email);
      // const savedToStorage = await cacheStorageService.get(`user-${user.id}`);
      // expect(savedToStorage).toBeTruthy();
    });

    test.each(['email', 'password'])(
      'Invalid %s is required',
      async (field) => {
        // Arrange
        delete signInDto[field];

        // Act
        const { statusCode } = await request(app.getHttpServer())
          .post('/authentication/sign-in')
          .send(signInDto);

        // Assert
        expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
      },
    );
  });

  describe('POST /authentication/refresh-tokens', () => {
    let signInDto: SignInDto;

    beforeEach(() => {
      signInDto = {
        email: faker.internet.email(),
        password: faker.internet.password({ prefix: '!Aa0' }),
      };
    });

    test('Regenerate access and refresh tokens when a valid refresh token is provided', async () => {
      // Arrange
      await request(app.getHttpServer())
        .post('/authentication/sign-up')
        .send({
          ...signInDto,
          confirmPassword: signInDto.password,
          name: 'any_name',
        });
      const signInRequest = await request(app.getHttpServer())
        .post('/authentication/sign-in')
        .send(signInDto);

      // Act
      const refreshTokenDto: RefreshTokenDto = {
        refreshToken: signInRequest.body.refreshToken,
      };
      const { statusCode, body } = await request(app.getHttpServer())
        .post('/authentication/refresh-tokens')
        .send(refreshTokenDto);

      // Assert
      expect(statusCode).toBe(HttpStatus.OK);
      expect(body.accessToken).toBeTruthy();
      expect(body.refreshToken).toBeTruthy();
    });
  });
});
