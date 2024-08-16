import { Test, TestingModule } from '@nestjs/testing';
import { AwsS3Service } from './aws-s3.service';
import awsS3Config from './aws-s3.config';
import { S3Client } from '@aws-sdk/client-s3';

jest.mock('@aws-sdk/client-s3');

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
          },
        },
      ],
    }).compile();

    sut = module.get<AwsS3Service>(AwsS3Service);
  });

  test('should config aws credentials on creation', async () => {
    expect(S3Client).toHaveBeenCalledWith({
      region: 'any_region',
    });
  });
});
