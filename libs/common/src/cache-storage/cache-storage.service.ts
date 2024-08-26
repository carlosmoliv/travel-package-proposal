import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class CacheStorageService {
  abstract set(key: string, value: string): Promise<void>;
  abstract get(key: string): Promise<string | null>;
  abstract del(key: string): Promise<void>;
}
