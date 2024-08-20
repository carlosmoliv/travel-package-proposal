import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { RedisService } from './redis/redis.service';
import { StorageService } from '../application/ports/storage.service';
import { AwsS3Service } from './file-storage/aws-s3/aws-s3.service';
import redisConfig from './redis/redis.config';
import { FileStorageService } from '../application/ports/file-storage.service';
import awsS3Config from './file-storage/aws-s3/aws-s3.config';

@Module({
  imports: [
    ConfigModule.forFeature(redisConfig),
    ConfigModule.forFeature(awsS3Config),
  ],
  providers: [
    { provide: StorageService, useClass: RedisService },
    { provide: FileStorageService, useClass: AwsS3Service },
  ],
  exports: [StorageService, FileStorageService],
})
export class SharedInfrastructureModule {}
