import { Injectable } from '@nestjs/common';

import { StorageService } from '../../../shared/application/ports/storage.service';

@Injectable()
export class RefreshTokenIdsStorage {
  constructor(private readonly storageService: StorageService) {}

  async insert(userId: string, tokenId: string): Promise<void> {
    await this.storageService.set(this.getKey(userId), tokenId);
  }

  async validate(userId: string, tokenId: string): Promise<boolean> {
    const storedId = await this.storageService.get(this.getKey(userId));
    return storedId === tokenId;
  }

  async invalidate(userId: string): Promise<void> {
    await this.storageService.del(this.getKey(userId));
  }

  private getKey(userId: string): string {
    return `user-${userId}`;
  }
}
