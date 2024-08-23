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
    test('Generates a hashed value from the data provided.', async () => {
      const data = '12345678';

      const hashedData = await sut.hash(data);

      expect(hashedData).not.toBe(data);
    });
  });

  describe('compare()', () => {
    test('Returns true if the provided data matches the hashed value.', async () => {
      const data = '12345678';
      const hashedData = await sut.hash(data);

      const dataMatch = await sut.compare(data, hashedData);

      expect(dataMatch).toBe(true);
    });

    test('Returns false if the provided data does not match the hashed value.', async () => {
      const data = '12345678';
      const hashedData = await sut.hash(data);

      const dataMatch = await sut.compare('invalid_data', hashedData);

      expect(dataMatch).toBe(false);
    });
  });
});
