import { Module } from '@nestjs/common';

import { RedisService } from './redis/redis.service';
import { AwsS3Service } from './file-storage/aws-s3/aws-s3.service';
import { FileStorageService } from '../application/ports/file-storage.service';
import { StorageService } from '@app/common/application/ports/storage.service';

@Module({
  providers: [
    { provide: StorageService, useClass: RedisService },
    { provide: FileStorageService, useClass: AwsS3Service },
  ],
  exports: [StorageService, FileStorageService],
})
export class SharedInfrastructureModule {}
