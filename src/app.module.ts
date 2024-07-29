import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { IamModule } from './iam/iam.module';
import { UserModule } from './user/user.module';
import { SharedModule } from './shared/shared.module';
import appConfig from './config/app.config';
import { typeOrmAsyncConfig } from './config/orm.config';
import { ClientModule } from './client/client.module';
import { TravelPackageModule } from './travel-package/travel-package.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
      envFilePath: process.env.NODE_ENV
        ? `.env.${process.env.NODE_ENV}`
        : '.env',
    }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    IamModule,
    UserModule,
    SharedModule,
    ClientModule,
    TravelPackageModule,
  ],
})
export class AppModule {}
