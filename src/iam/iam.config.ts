import { registerAs } from '@nestjs/config';

export default registerAs('iam', () => {
  return {
    accessTokenTtl: parseInt(process.env.ACCESS_TOKEN_TTL ?? '3600', 10),
  };
});
