import Redis from 'ioredis';

import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import { StorageService } from '../../application/ports/storage.service';
import redisConfig from './redis.config';

@Injectable()
export class RedisService
  implements StorageService, OnApplicationBootstrap, OnApplicationBootstrap
{
  private redisClient: Redis;

  constructor(
    @Inject(redisConfig.KEY)
    private readonly redisConfiguration: ConfigType<typeof redisConfig>,
  ) {}

  onApplicationBootstrap() {
    this.redisClient = new Redis({
      host: this.redisConfiguration.host,
      port: this.redisConfiguration.port,
    });
  }

  onApplicationShutdown() {
    return this.redisClient.quit();
  }

  async set(key: string, value: string): Promise<void> {
    await this.redisClient.set(key, value);
  }

  async get(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  async del(key: string): Promise<void> {
    await this.redisClient.del(key);
  }
}
