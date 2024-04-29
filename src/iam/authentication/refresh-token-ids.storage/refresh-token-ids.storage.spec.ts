import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

import { RefreshTokenIdsStorage } from './refresh-token-ids.storage';
import { StorageService } from '../../../shared/application/ports/storage.service';

describe('RefreshTokenIdsStorageService', () => {
  let sut: RefreshTokenIdsStorage;
  let storageService: MockProxy<StorageService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshTokenIdsStorage,
        { provide: StorageService, useValue: mock() },
      ],
    }).compile();
    sut = module.get<RefreshTokenIdsStorage>(RefreshTokenIdsStorage);
    storageService = module.get<MockProxy<StorageService>>(StorageService);
  });

  describe('insert()', () => {
    test('Insert token with correct key into storage', async () => {
      const userId = '123';
      const tokenId = 'abc123';
      const expectedKey = 'user-123';

      await sut.insert(userId, tokenId);

      expect(storageService.set).toHaveBeenCalledWith(expectedKey, tokenId);
      expect(storageService.set).toHaveBeenCalledTimes(1);
    });
  });

  describe('validate()', () => {
    test('Validate returns true if token is valid', async () => {
      const userId = '123';
      const tokenId = 'abc123';
      storageService.get.mockResolvedValue(tokenId);

      const result = await sut.validate(userId, tokenId);

      expect(result).toBe(true);
    });

    test('Validate returns false if token is invalid', async () => {
      const userId = '123';
      const tokenId = 'abc123';
      const invalidTokenId = 'invalid_token';
      storageService.get.mockResolvedValue(tokenId);

      const result = await sut.validate(userId, invalidTokenId);

      expect(result).toBe(false);
    });
  });

  describe('invalidate()', () => {
    test('Delete the token for the specified user', async () => {
      const userId = '123';
      const expectedKey = 'user-123';
      storageService.del.mockResolvedValue();

      await sut.invalidate(userId);

      expect(storageService.del).toHaveBeenCalledWith(expectedKey);
      expect(storageService.del).toHaveBeenCalledTimes(1);
    });
  });
});
