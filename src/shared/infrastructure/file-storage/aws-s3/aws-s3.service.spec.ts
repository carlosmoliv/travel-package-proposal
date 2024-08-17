import 'aws-sdk-client-mock-jest';
import { mockClient } from 'aws-sdk-client-mock';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

import { Test, TestingModule } from '@nestjs/testing';

import { AwsS3Service } from './aws-s3.service';
import awsS3Config from './aws-s3.config';

const s3Mock = mockClient(S3Client);

describe('AwsS3Service', () => {
  let sut: AwsS3Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AwsS3Service,
        {
          provide: awsS3Config.KEY,
          useValue: {
            s3Region: 'any_region',
            bucketName: 'any_bucket_name',
          },
        },
      ],
    }).compile();

    sut = module.get<AwsS3Service>(AwsS3Service);
  });

  afterEach(() => {
    s3Mock.reset();
  });

  test('should config aws credentials on creation', () => {
    expect(S3Client).toHaveBeenCalledWith({
      region: 'any_region',
    });
  });

  describe('upload()', () => {
    test('upload file to S3 storage', async () => {
      const fileBuffer = Buffer.from('file content');
      const fileName = 'test-file.txt';

      s3Mock.on(PutObjectCommand).resolves({});

      await sut.upload(fileBuffer, fileName);

      expect(s3Mock).toHaveReceivedCommandWith(PutObjectCommand, {
        Bucket: 'any_bucket_name',
        Key: fileName,
        Body: fileBuffer,
      });
    });
  });
});
