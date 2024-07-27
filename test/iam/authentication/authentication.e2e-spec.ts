import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';

import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IamModule } from '../../../src/iam/iam.module';
import { UserRepository } from '../../../src/user/application/ports/user.repository';
import { SignUpDto } from '../../../src/iam/authentication/presenters/dtos/sign-up.dto';
import { SignInDto } from '../../../src/iam/authentication/presenters/dtos/sign-in.dto';
import { StorageService } from '../../../src/shared/application/ports/storage.service';
import { RefreshTokenDto } from '../../../src/iam/authentication/presenters/dtos/refresh-token.dto';
import { OrmHelper } from '../../helpers/orm.helper';
import { OrmUser } from '../../../src/user/infrastructure/persistance/orm/entities/orm-user.entity';
import { fakeSignUpDto } from '../../fakes/dtos/make-fake-signup-dto';
import { RoleService } from '../../../src/iam/authorization/application/role.service';
import { RoleName } from '../../../src/iam/authorization/domain/enums/role-name.enum';
import { OrmRole } from '../../../src/iam/authorization/infrastructure/persistence/orm/entities/orm-role.entity';
import { OrmPermission } from '../../../src/iam/authorization/infrastructure/persistence/orm/entities/orm-permission.entity';

describe('Authentication (e2e)', () => {
  let app: INestApplication;
  let userRepository: UserRepository;
  let storageService: StorageService;

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
          synchronize: false,
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

    userRepository = moduleFixture.get<UserRepository>(UserRepository);
    storageService = moduleFixture.get<StorageService>(StorageService);

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

      const userExists = await userRepository.findByEmail(signUpDto.email);
      expect(userExists).toBeTruthy();
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

      const user = await userRepository.findByEmail(signInDto.email);
      const savedToStorage = await storageService.get(`user-${user.id}`);
      expect(savedToStorage).toBeTruthy();
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
