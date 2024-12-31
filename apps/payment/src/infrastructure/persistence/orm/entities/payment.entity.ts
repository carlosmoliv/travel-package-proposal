import { Column, Entity } from 'typeorm';

import { BaseEntity } from '@app/common/persistence/orm/entities/base.entity';

import { PaymentStatus } from '../../../../domain/enums/payment-status.enum';

@Entity('payments')
export class PaymentEntity extends BaseEntity {
  @Column()
  id: string;

  @Column()
  amount: number;

  @Column()
  status: PaymentStatus;

  @Column()
  customerEmail: string;
}
