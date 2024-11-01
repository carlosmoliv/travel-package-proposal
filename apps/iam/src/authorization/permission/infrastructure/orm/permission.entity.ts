import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { PermissionType } from '@app/common/iam/permission.type';
import { BaseEntity } from '@app/common/persistence/orm/entities/base.entity';

import { RoleEntity } from '../../../role/infrastructure/orm/role.entity';

@Entity('permissions')
export class PermissionEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  type: PermissionType;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => RoleEntity, (role) => role.permissions)
  roles: RoleEntity[];
}
