export default () => ({
  environment: process.env.NODE_ENV || 'development',
  port: process.env.PORT ?? 3001,
  accessTokenTtl: parseInt(process.env.ACCESS_TOKEN_TTL ?? '3600', 10),
  refreshTokenTtl: parseInt(process.env.REFRESH_TOKEN_TTL ?? '86400', 10),
});
