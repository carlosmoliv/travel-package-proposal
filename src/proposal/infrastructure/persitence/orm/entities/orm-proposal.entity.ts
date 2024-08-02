import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

import { OrmClient } from '../../../../../client/infrastructure/persitence/orm/entities/orm-client.entity';
import { ProposalStatus } from '../../../../domain/enums/proposal-status';
import { OrmTravelPackage } from '../../../../../travel-package/infrastructure/persistence/orm/entities/orm-travel-package.entity';
import { OrmBaseEntity } from '../../../../../shared/infrastructure/persistence/orm/entities/orm-base.entity';

@Entity('proposals')
export class OrmProposal extends OrmBaseEntity {
  @ManyToOne(() => OrmClient, (client) => client.bookings)
  client: OrmClient;

  @ManyToMany(() => OrmTravelPackage)
  @JoinTable()
  travelPackages: OrmTravelPackage[];

  @Column()
  message: string;

  @Column({ type: 'enum', enum: ProposalStatus })
  status: ProposalStatus;
}
