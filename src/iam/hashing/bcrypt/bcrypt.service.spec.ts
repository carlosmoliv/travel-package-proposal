import { Test, TestingModule } from '@nestjs/testing';
import { BcryptService } from './bcrypt.service';

describe('BcryptService', () => {
  let sut: BcryptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BcryptService],
    }).compile();
    sut = module.get<BcryptService>(BcryptService);
  });

  describe('hash()', () => {
    test('Generates a hashed value from the data provided', () => {
      const data = '12345678';

      const hashedData = sut.hash(data);

      expect(hashedData).not.toBe(data);
    });
  });
});
