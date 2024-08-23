import { Column, Entity, OneToOne, JoinColumn, OneToMany } from 'typeorm';

import { OrmBaseEntity } from '../../../../../shared/infrastructure/persistence/orm/entities/orm-base.entity';
import { OrmUser } from '../../../../../user/infrastructure/persistance/orm/entities/orm-user.entity';
import { OrmProposal } from '../../../../../proposal/infrastructure/persitence/orm/entities/orm-proposal.entity';

@Entity('clients')
export class OrmClient extends OrmBaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToOne(() => OrmUser, (user) => user.client)
  @JoinColumn()
  user: OrmUser;

  @Column()
  contactInfo: string;

  @Column()
  preferences?: string;

  @OneToMany(() => OrmProposal, (proposal) => proposal.client)
  bookings: OrmProposal[];
}
