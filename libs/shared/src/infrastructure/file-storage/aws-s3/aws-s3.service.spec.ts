import 'aws-sdk-client-mock-jest';
import { mockClient } from 'aws-sdk-client-mock';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { Test, TestingModule } from '@nestjs/testing';

import { AwsS3Service } from './aws-s3.service';

jest.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: jest.fn(),
}));

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

  describe('getUrl()', () => {
    test('should return signed URL for S3 object', async () => {
      // Arrange
      const fileName = 'test-file.txt';
      const expectedUrl =
        'https://s3.amazonaws.com/any_bucket_name/test-file.txt?signature=some_signature';

      (getSignedUrl as jest.Mock).mockResolvedValue(expectedUrl);

      // Act
      const url = await sut.getUrl(fileName);

      // Assert
      expect(getSignedUrl).toHaveBeenCalledWith(
        expect.any(S3Client),
        expect.any(GetObjectCommand),
        { expiresIn: 3600 },
      );
      expect(url).toBe(expectedUrl);
    });
  });
});
