import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

import { BaseEntity } from '@app/common/persistence/orm/entities/base.entity';

import { RoleEntity } from '../../../../../authorization/role/infrastructure/orm/role.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @ManyToMany(() => RoleEntity, (role) => role.users)
  @JoinTable({ name: 'user_roles' })
  roles: RoleEntity[];
}
