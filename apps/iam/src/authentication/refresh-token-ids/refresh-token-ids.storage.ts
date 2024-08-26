import { Injectable } from '@nestjs/common';

import { InvalidateRefreshTokenError } from './invalidate-refresh-token.error';
import { CacheStorageService } from '@app/common/cache-storage/cache-storage.service';

@Injectable()
export class RefreshTokenIdsStorage {
  constructor(private readonly storageService: CacheStorageService) {}

  async insert(userId: string, tokenId: string): Promise<void> {
    await this.storageService.set(this.getKey(userId), tokenId);
  }

  async validate(userId: string, tokenId: string): Promise<void> {
    const storedId = await this.storageService.get(this.getKey(userId));
    if (storedId !== tokenId) throw new InvalidateRefreshTokenError();
  }

  async invalidate(userId: string): Promise<void> {
    await this.storageService.del(this.getKey(userId));
  }

  private getKey(userId: string): string {
    return `user-${userId}`;
  }
}
