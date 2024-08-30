import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrmPermission } from './infrastructure/orm/orm-permission.entity';
import { PermissionService } from './application/permission.service';
import { PermissionRepository } from './application/ports/permission.repository';
import { OrmPermissionRepository } from './infrastructure/orm/orm-permission.repository';
import { PermissionController } from './presenters/controllers/permission.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OrmPermission])],
  providers: [
    PermissionService,
    {
      provide: PermissionRepository,
      useClass: OrmPermissionRepository,
    },
  ],
  controllers: [PermissionController],
  exports: [PermissionService],
})
export class PermissionModule {}
