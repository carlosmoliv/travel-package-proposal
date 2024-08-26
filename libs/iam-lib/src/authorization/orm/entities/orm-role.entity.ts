import { Column, Entity, ManyToMany, JoinTable } from 'typeorm';

import { OrmPermission } from './orm-permission.entity';
import { OrmBaseEntity, RoleName } from '@app/shared';

@Entity('roles')
export class OrmRole extends OrmBaseEntity {
  @Column({ unique: true })
  name: RoleName;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => OrmPermission, {
    cascade: true,
  })
  @JoinTable({
    name: 'role_permissions',
  })
  permissions: OrmPermission[];
}
