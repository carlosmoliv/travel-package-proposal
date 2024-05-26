import {
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  JoinTable,
} from 'typeorm';

import { OrmPermission } from '../../../../../iam/authorization/infrastructure/persistence/orm/entities/orm-permission.entity';
import { RoleName } from '../../../../../iam/authorization/domain/enums/role-name.enum';

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
