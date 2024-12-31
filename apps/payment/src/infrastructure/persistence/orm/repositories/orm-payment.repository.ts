import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

import { PaymentRepository } from 'apps/payment/src/application/ports/payment-repository.service';
import { PaymentEntity } from '../entities/payment.entity';
import { Payment } from 'apps/payment/src/domain/payment';

@Injectable()
export class OrmPaymentRepository implements PaymentRepository {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
  ) {}

  async save(payment: Payment): Promise<void> {
    const paymentInstance = this.paymentRepository.create(payment);
    await this.paymentRepository.save(paymentInstance);
  }

  async findById(id: string): Promise<Payment> {
    return this.paymentRepository.findOne({ where: { id } });
  }

  async findOne(id: string): Promise<Payment> {
    return this.paymentRepository.findOne({ where: { id } });
  }
}
