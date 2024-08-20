import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';

import { AwsS3Service } from '../../src/shared/infrastructure/file-storage/aws-s3/aws-s3.service';
import { ConfigModule } from '@nestjs/config';
import awsS3Config from '../../src/shared/infrastructure/file-storage/aws-s3/aws-s3.config';

describe('AwsS3Service (e2e external)', () => {
  let app: INestApplication;
  let awsS3Service: AwsS3Service;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forFeature(awsS3Config)],
      providers: [AwsS3Service],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
    awsS3Service = moduleFixture.get<AwsS3Service>(AwsS3Service);
  });

  afterAll(() => {
    app.close();
  });

  test('Upload a file to AWS S3', async () => {
    // Arrange
    const fileName = 'test-file.txt';
    const fileContent = Buffer.from('This is a test file content.');

    // Act
    await awsS3Service.upload(fileContent, fileName);

    // Assert
  });
});
