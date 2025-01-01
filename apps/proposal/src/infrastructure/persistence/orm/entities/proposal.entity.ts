import { Column, Entity } from 'typeorm';

import { BaseEntity } from '@app/common/persistence/orm/entities/base.entity';

import { ProposalStatus } from '../../../../domain/enums/proposal-status';

@Entity('proposals')
export class ProposalEntity extends BaseEntity {
  @Column()
  clientId: string;

  @Column()
  travelAgentId: string;

  @Column()
  travelPackageId: string;

  @Column()
  status: ProposalStatus;

  @Column({ type: 'decimal' })
  price: number;
}
