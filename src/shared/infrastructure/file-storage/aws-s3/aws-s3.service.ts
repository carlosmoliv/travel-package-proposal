import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import awsS3Config from './aws-s3.config';
import { S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class AwsS3Service {
  private readonly s3Client: S3Client;

  constructor(
    @Inject(awsS3Config.KEY)
    private readonly awsConfiguration: ConfigType<typeof awsS3Config>,
  ) {
    this.s3Client = new S3Client({
      region: this.awsConfiguration.s3Region,
    });
  }
}
