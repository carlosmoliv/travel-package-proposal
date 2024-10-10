import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { PermissionType } from '@app/common/iam/permission.type';
import { OrmBaseEntity } from '@app/common/persistence/orm/entities/orm-base.entity';

import { OrmRole } from '../../../role/infrastructure/orm/orm-role.entity';

@Entity('permissions')
export class OrmPermission extends OrmBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  type: PermissionType;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => OrmRole, (role) => role.permissions)
  roles: OrmRole[];
}
