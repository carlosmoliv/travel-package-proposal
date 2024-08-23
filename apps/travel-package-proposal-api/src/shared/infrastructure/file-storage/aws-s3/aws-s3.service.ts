import {
  PutObjectCommand,
  S3Client,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import awsS3Config from './aws-s3.config';
import { FileStorageService } from '../../../application/ports/file-storage.service';

@Injectable()
export class AwsS3Service implements FileStorageService {
  private readonly s3Client: S3Client;

  constructor(
    @Inject(awsS3Config.KEY)
    private readonly awsConfiguration: ConfigType<typeof awsS3Config>,
  ) {
    this.s3Client = new S3Client({
      region: this.awsConfiguration.s3Region,
    });
  }

  async upload(file: Buffer, fileName: string): Promise<void> {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.awsConfiguration.bucketName,
        Key: fileName,
        Body: file,
      }),
    );
  }

  async getUrl(fileName: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.awsConfiguration.bucketName,
      Key: fileName,
    });
    return getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
  }
}
