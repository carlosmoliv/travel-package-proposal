import { mock, MockProxy } from 'jest-mock-extended';

import { Test, TestingModule } from '@nestjs/testing';

import { NotificationService } from './notification.service';
import { EmailService } from './ports/email.service';

describe('NotificationService', () => {
  let sut: NotificationService;
  let emailService: MockProxy<EmailService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: EmailService,
          useValue: mock(),
        },
      ],
    }).compile();

    sut = module.get<NotificationService>(NotificationService);
    emailService = module.get<MockProxy<EmailService>>(EmailService);
  });

  describe('sendEmail', () => {
    it('should call emailService.sendEmail with correct parameters', async () => {
      const to = 'test@example.com';
      const subject = 'Test Subject';
      const body = 'Test Body';

      await sut.sendEmail(to, subject, body);

      expect(emailService.sendEmail).toHaveBeenCalledWith(to, subject, body);
      expect(emailService.sendEmail).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if emailService.sendEmail fails', async () => {
      const to = 'test@example.com';
      const subject = 'Test Subject';
      const body = 'Test Body';

      emailService.sendEmail.mockRejectedValue(
        new Error('Email sending failed'),
      );

      await expect(sut.sendEmail(to, subject, body)).rejects.toThrow(
        'Email sending failed',
      );
    });
  });
});
