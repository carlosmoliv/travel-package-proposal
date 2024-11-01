import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { PermissionType } from '@app/common/iam/permission.type';
import { OrmBaseEntity } from '@app/common/persistence/orm/entities/orm-base.entity';

import { RoleEntity } from '../../../role/infrastructure/orm/role.entity';

@Entity('permissions')
export class OrmPermission extends OrmBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  type: PermissionType;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => RoleEntity, (role) => role.permissions)
  roles: RoleEntity[];
}
