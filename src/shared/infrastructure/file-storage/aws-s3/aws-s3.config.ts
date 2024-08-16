import { registerAs } from '@nestjs/config';

export default registerAs('awsS3', () => {
  return {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    s3Region: process.env.AWS_S3_REGION,
    bucketName: process.env.AWS_BUCKET_NAME,
  };
});
