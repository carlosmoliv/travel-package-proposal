import { DataSource } from 'typeorm';

import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';

export const ormConfig = {
  type: 'postgres' as const,
  url:
    process.env.DATABASE_URL ||
    'postgresql://postgres:pass123@iam-postgres-db:5432/iam-db',
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
