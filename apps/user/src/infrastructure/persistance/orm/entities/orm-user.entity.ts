import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

import { OrmBaseEntity, OrmRole } from '@app/shared';

@Entity('users')
export class OrmUser extends OrmBaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @ManyToMany(() => OrmRole)
  @JoinTable({
    name: 'user_roles',
  })
  roles?: OrmRole[];
}
