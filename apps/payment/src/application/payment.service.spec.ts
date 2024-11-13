import { mock, MockProxy } from 'jest-mock-extended';
import { faker } from '@faker-js/faker';

import { Test, TestingModule } from '@nestjs/testing';

import { ProposalStatus } from '../../../proposal/src/domain/enums/proposal-status';
import { PaymentRepository } from './ports/payment.repository';
import { PaymentService } from './payment.service';
import { CreatePaymentInput } from './inputs/create-payment.input';

describe('PaymentService', () => {
  let sut: PaymentService;
  let paymentRepository: MockProxy<PaymentRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        { provide: PaymentRepository, useValue: mock() },
      ],
    }).compile();

    sut = module.get<PaymentService>(PaymentService);
  });

  describe('create', () => {
    it('process and save the payment', async () => {
      const input: CreatePaymentInput = { amount: faker };

      await sut.processPayment(input);

      expect(payment.save).toHaveBeenCalledWith(
        expect.objectContaining({
          clientId: 'client_id',
          travelAgentId: 'agent_id',
          travelPackageId: 'package_id',
          status: ProposalStatus.Pending,
        }),
      );
    });
  });
});
