import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { PermissionType } from '../../../permission.type';

@Entity('permissions')
export class OrmPermission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  type: PermissionType;

  @Column({ nullable: true })
  description: string;
}
