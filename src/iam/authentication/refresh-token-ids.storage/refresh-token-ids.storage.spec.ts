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

  test('Insert token with correct key into storage', async () => {
    const userId = '123';
    const tokenId = 'abc123';
    const expectedKey = 'user-123';

    await sut.insert(userId, tokenId);

    expect(storageService.set).toHaveBeenCalledTimes(1);
    expect(storageService.set).toHaveBeenCalledWith(expectedKey);
  });
});
