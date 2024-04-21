export default () => ({
  environment: process.env.NODE_ENV || 'development',
  port: process.env.PORT ?? 3000,
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    username: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'pass123',
    name: process.env.DATABASE_NAME || 'travel-package-proposal-db',
  },
});
