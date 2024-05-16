import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { PermissionType } from '../../../permission.type';
import { OrmRole } from '../../../../../user/infrastructure/persistance/orm/entities/orm-role.entity';

@Entity('permissions')
export class OrmPermission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  type: PermissionType;

  @Column({ nullable: true })
  description: string;

  roles: OrmRole[];
}
