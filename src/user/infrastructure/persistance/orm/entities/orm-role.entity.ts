import {
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  JoinTable,
} from 'typeorm';

import { OrmPermission } from '../../../../../iam/authorization/persistence/orm/entities/permission.entity';
import { RoleName } from '../../../../role-name.enum';

@Entity('roles')
export class OrmRole {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: RoleName;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => OrmPermission)
  @JoinTable()
  permissions: OrmPermission[];
}
