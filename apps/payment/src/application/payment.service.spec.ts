import { mock, MockProxy } from 'jest-mock-extended';

import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';

import { NOTIFICATION_SERVICE } from '@app/common/constants';
import { UUID_REGEX } from '@app/common/test/constants/regex.constant';

import { PaymentService } from './payment.service';
import { CreatePaymentInput } from './inputs/create-payment.input';
import { PaymentGatewayService } from './ports/payment-gateway.service';
import { PaymentRepository } from './ports/payment-repository.service';

describe('PaymentService', () => {
  let sut: PaymentService;
  let paymentGatewayMock: MockProxy<PaymentGatewayService>;
  let paymentRepositoryMock: MockProxy<PaymentRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: PaymentGatewayService,
          useValue: mock(),
        },
        {
          provide: PaymentRepository,
          useValue: mock(),
        },
        {
          provide: NOTIFICATION_SERVICE,
          useValue: mock(),
        },
      ],
    }).compile();

    sut = module.get<PaymentService>(PaymentService);
    paymentGatewayMock = module.get<MockProxy<PaymentGatewayService>>(
      PaymentGatewayService,
    );
    paymentRepositoryMock =
      module.get<MockProxy<PaymentRepository>>(PaymentRepository);
  });

  describe('create', () => {
    const mockInput: CreatePaymentInput = {
      amount: 100,
      customerEmail: 'any_email@email.com',
    };

    it('should create a payment and return the reference ID', async () => {
      // Arrange
      const url = 'http://checkout_url';
      paymentRepositoryMock.save.mockResolvedValue();
      paymentGatewayMock.createCheckout.mockResolvedValue(url);

      // Act
      const result = await sut.create(mockInput);

      // Assert
      expect(paymentGatewayMock.createCheckout).toHaveBeenCalledWith(
        mockInput.amount,
        expect.stringMatching(UUID_REGEX),
      );
      expect(result).toBe(url);
    });

    it('should log an error and throw InternalServerErrorException if the payment fails', async () => {
      const error = new Error('Gateway error');
      paymentGatewayMock.createCheckout.mockRejectedValue(error);

      await expect(sut.create(mockInput)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
