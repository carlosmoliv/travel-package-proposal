import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';

import { JwtService } from './jwt.service';
import jwtConfig from './jwt.config';

describe('JwtService', () => {
  let service: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.registerAsync({
          useFactory: () => ({}),
        }),
      ],
      providers: [
        JwtService,
        {
          provide: jwtConfig.KEY,
          useValue: {
            audience: 'test-audience',
            issuer: 'test-issuer',
            secret: 'test-secret',
          },
        },
      ],
    }).compile();

    service = module.get<JwtService>(JwtService);
  });

  describe('generate()', () => {
    it('Generate a token', async () => {
      const payload = { userId: '123', role: 'admin' };
      const expirationInSeconds = 3600;

      const token = await service.generate(payload, expirationInSeconds);

      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');
    });
  });
});
