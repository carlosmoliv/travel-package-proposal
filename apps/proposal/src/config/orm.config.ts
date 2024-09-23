import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export const ormConfig = {
  type: 'postgres' as const,
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'pass123',
  database: process.env.DATABASE_NAME || 'proposal-packaged-db',
  synchronize: true,
  logging: false,
  migrationsTableName: 'typeorm_migrations',
  autoLoadEntities: true,
  // entities: ['dist/**/*.entity.{ts,js}'],
  migrations: ['dist/migrations/*.{ts,js}'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  useFactory: async (): Promise<TypeOrmModuleOptions> => {
    return ormConfig;
  },
};

export default new DataSource(ormConfig);
