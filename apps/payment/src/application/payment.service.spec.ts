import { mock, MockProxy } from 'jest-mock-extended';

import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';

import { NOTIFICATION_SERVICE } from '@app/common/constants';
import { UUID_REGEX } from '@app/common/test/constants/regex.constant';

import { PaymentService } from './payment.service';
import { CreatePaymentInput } from './inputs/create-payment.input';
import { PaymentGatewayService } from './ports/payment-gateway.service';
import { PaymentRepository } from './ports/payment-repository.service';
import { PaymentFactory } from '../domain/factories/payment.factory';
import { PaymentStatus } from '../domain/enums/payment-status.enum';
import { Payment } from '../domain/payment';
import { ConfirmPaymentInput } from './inputs/confirm-payment.input';

describe('PaymentService', () => {
  let sut: PaymentService;
  let paymentGatewayMock: MockProxy<PaymentGatewayService>;
  let paymentRepositoryMock: MockProxy<PaymentRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        PaymentFactory,
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

  describe('confirmPayment', () => {
    const mockPayment: Payment = {
      id: 'payment-id',
      amount: 100,
      customerEmail: 'any_email@email.com',
      status: PaymentStatus.Unpaid,
    };

    const mockInput: ConfirmPaymentInput = { paymentId: mockPayment.id };

    it('should confirm a payment and emit a notification', async () => {
      // Arrange
      paymentRepositoryMock.findOne.mockResolvedValue(mockPayment);
      paymentRepositoryMock.save.mockResolvedValue();
      const emitSpy = jest
        .spyOn(sut['notificationClient'], 'emit')
        .mockReturnValue({ subscribe: jest.fn() } as any);

      // Act
      await sut.confirmPayment(mockInput);

      // Assert
      expect(paymentRepositoryMock.findOne).toHaveBeenCalledWith(
        mockInput.paymentId,
      );
      expect(paymentRepositoryMock.save).toHaveBeenCalledWith({
        ...mockPayment,
        status: PaymentStatus.Paid,
      });
      expect(emitSpy).toHaveBeenCalledWith('notify.email', {
        recipient: mockPayment.customerEmail,
        subject: 'Payment Successful',
        message: 'Thank you for your payment!',
      });
    });

    it('should throw an InternalServerErrorException if the payment is not found', async () => {
      // Arrange
      paymentRepositoryMock.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(sut.confirmPayment(mockInput)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(paymentRepositoryMock.findOne).toHaveBeenCalledWith(
        mockInput.paymentId,
      );
      expect(paymentRepositoryMock.save).not.toHaveBeenCalled();
    });

    it('should log an error if notification emission fails', async () => {
      // Arrange
      paymentRepositoryMock.findOne.mockResolvedValue(mockPayment);
      paymentRepositoryMock.save.mockResolvedValue();
      const errorMsg = 'Notification service error';
      jest.spyOn(sut['notificationClient'], 'emit').mockImplementation(() => {
        throw new Error(errorMsg);
      });

      // Act & Assert
      await expect(sut.confirmPayment(mockInput)).rejects.toThrow(
        Error(errorMsg),
      );

      expect(paymentRepositoryMock.findOne).toHaveBeenCalledWith(
        mockInput.paymentId,
      );
      expect(paymentRepositoryMock.save).toHaveBeenCalledWith({
        ...mockPayment,
        status: PaymentStatus.Paid,
      });
    });
  });
});
