import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { PermissionType } from '../../../../domain/types/permission.type';
import { OrmBaseEntity } from '../../../../../../shared/infrastructure/persistence/orm/entities/orm-base.entity';

@Entity('permissions')
export class OrmPermission extends OrmBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  type: PermissionType;

  @Column({ nullable: true })
  description: string;
}
