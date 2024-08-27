import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';

import { JwtService } from './jwt.service';
import { ConfigService } from '@nestjs/config';

describe('JwtService', () => {
  let sut: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.registerAsync({
          useFactory: () => ({
            secret: 'test-secret',
            signOptions: { expiresIn: '1h' },
          }),
        }),
      ],
      providers: [
        JwtService,
        {
          provide: ConfigService,
          useValue: {
            get: (key: string) => {
              switch (key) {
                case 'JWT_SECRET':
                  return 'test-secret';
                case 'JWT_TOKEN_AUDIENCE':
                  return 'test-audience';
                case 'JWT_TOKEN_ISSUER':
                  return 'test-issuer';
                default:
                  return undefined;
              }
            },
          },
        },
      ],
    }).compile();

    sut = module.get<JwtService>(JwtService);
  });

  describe('generate()', () => {
    it('Generate a token', async () => {
      const payload = { userId: '123', role: 'admin' };
      const expirationInSeconds = 3600;

      const token = await sut.generate(payload, expirationInSeconds);

      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');
    });
  });
});
