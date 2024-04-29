import { Injectable } from '@nestjs/common';

import { StorageService } from '../../../shared/application/ports/storage.service';

@Injectable()
export class RefreshTokenIdsStorage {
  constructor(private readonly storageService: StorageService) {}

  async insert(userId: string, tokenId: string): Promise<void> {
    await this.storageService.set(this.getKey(userId), tokenId);
  }

  private getKey(userId: string): string {
    return `user-${userId}`;
  }
}
