import { registerAs } from '@nestjs/config';

export default registerAs('iam', () => {
  return {
    accessTokenTtl: parseInt(process.env.ACCESS_TOKEN_TTL ?? '3600', 10),
    refreshTokenTtl: parseInt(process.env.REFRESH_TOKEN_TTL ?? '86400', 10),
  };
});
