import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { OrmBaseEntity, PermissionType } from '@app/shared';

@Entity('permissions')
export class OrmPermission extends OrmBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  type: PermissionType;

  @Column({ nullable: true })
  description: string;
}
