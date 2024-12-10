import { mock, MockProxy } from 'jest-mock-extended';

import { Test, TestingModule } from '@nestjs/testing';

import { PaymentService } from './payment.service';
import { CreatePaymentInput } from './inputs/create-payment.input';
import { PaymentGatewayService } from './ports/payment-gateway.service';
import { InternalServerErrorException } from '@nestjs/common';

describe('PaymentService', () => {
  let sut: PaymentService;
  let paymentGatewayMock: MockProxy<PaymentGatewayService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: PaymentGatewayService,
          useValue: mock(),
        },
      ],
    }).compile();

    sut = module.get<PaymentService>(PaymentService);
    paymentGatewayMock = module.get<MockProxy<PaymentGatewayService>>(
      PaymentGatewayService,
    );
  });

  describe('create', () => {
    const mockInput: CreatePaymentInput = { amount: 100 };

    it('should create a payment and return the reference ID', async () => {
      // Arrange
      const url = 'http://checkout_url';
      paymentGatewayMock.createCheckout.mockResolvedValue(url);

      // Act
      const result = await sut.create(mockInput);

      // Assert
      expect(paymentGatewayMock.createCheckout).toHaveBeenCalledWith(100);
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
