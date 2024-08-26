import { Module } from '@nestjs/common';

import { CacheStorageService } from '@app/common/cache-storage/cache-storage.service';
import { RedisService } from '@app/common/cache-storage/redis/redis.service';
import { FileStorageService } from '@app/common/file-storage/file-storage.service';
import { AwsS3Service } from '@app/common/file-storage/aws-s3/aws-s3.service';

@Module({
  providers: [
    { provide: CacheStorageService, useClass: RedisService },
    { provide: FileStorageService, useClass: AwsS3Service },
  ],
  exports: [CacheStorageService, FileStorageService],
})
export class CommonModule {}
