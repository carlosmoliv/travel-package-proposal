import { Column, Entity, ManyToMany, JoinTable } from 'typeorm';

import { OrmPermission } from './orm-permission.entity';
import { RoleName } from '../../../../domain/enums/role-name.enum';
import { OrmBaseEntity } from '../../../../../../shared/infrastructure/persistence/orm/entities/orm-base.entity';

@Entity('roles')
export class OrmRole extends OrmBaseEntity {
  @Column({ unique: true })
  name: RoleName;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => OrmPermission)
  @JoinTable({
    name: 'role_permissions',
  })
  permissions: OrmPermission[];
}
