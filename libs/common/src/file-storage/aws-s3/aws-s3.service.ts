import {
  PutObjectCommand,
  S3Client,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { FileStorageService } from '@app/common/file-storage/file-storage.service';

@Injectable()
export class AwsS3Service implements FileStorageService {
  private readonly s3Client: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get('AWS_S3_REGION'),
    });
  }

  async upload(file: Buffer, fileName: string): Promise<void> {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.configService.get('AWS_BUCKET_NAME'),
        Key: fileName,
        Body: file,
      }),
    );
  }

  async getUrl(fileName: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.configService.get('AWS_BUCKET_NAME'),
      Key: fileName,
    });
    return getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
  }
}
