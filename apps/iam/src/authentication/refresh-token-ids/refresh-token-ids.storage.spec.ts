import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

import { RefreshTokenIdsStorage } from './refresh-token-ids.storage';
import { InvalidateRefreshTokenError } from './invalidate-refresh-token.error';
import { CacheStorageService } from '@app/common/cache-storage/cache-storage.service';

describe('RefreshTokenIdsStorageService', () => {
  let sut: RefreshTokenIdsStorage;
  let storageService: MockProxy<CacheStorageService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshTokenIdsStorage,
        { provide: CacheStorageService, useValue: mock() },
      ],
    }).compile();
    sut = module.get<RefreshTokenIdsStorage>(RefreshTokenIdsStorage);
    storageService =
      module.get<MockProxy<CacheStorageService>>(CacheStorageService);
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

      await expect(sut.validate(userId, tokenId)).resolves.not.toThrow();
    });

    test('Throw InvalidateRefreshTokenError when token does not match', async () => {
      const userId = '123';
      const tokenId = 'abc123';
      const invalidTokenId = 'invalid_token';
      storageService.get.mockResolvedValue(tokenId);

      const promise = sut.validate(userId, invalidTokenId);

      await expect(promise).rejects.toThrow(InvalidateRefreshTokenError);
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
