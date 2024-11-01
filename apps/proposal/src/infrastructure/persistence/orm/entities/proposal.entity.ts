import { Column, Entity } from 'typeorm';

import { OrmBaseEntity } from '@app/common/persistence/orm/entities/orm-base.entity';

import { ProposalStatus } from '../../../../domain/enums/proposal-status';

@Entity('proposals')
export class ProposalEntity extends OrmBaseEntity {
  @Column()
  clientId: string;

  @Column()
  travelAgentId: string;

  @Column()
  travelPackageId: string;

  @Column()
  status: ProposalStatus;
}
