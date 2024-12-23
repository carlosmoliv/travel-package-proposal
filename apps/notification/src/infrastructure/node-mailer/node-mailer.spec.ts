import { createTransport } from 'nodemailer';
import { Transporter } from 'nodemailer';

import { Test, TestingModule } from '@nestjs/testing';

import { NodemailerService } from './node-mailer.service';

jest.mock('nodemailer', () => ({
  createTransport: jest.fn(),
}));

describe('NodemailerService', () => {
  let service: NodemailerService;
  let transporterMock: jest.Mocked<Transporter>;

  beforeEach(async () => {
    transporterMock = {
      sendMail: jest.fn(),
    } as unknown as jest.Mocked<Transporter>;

    (createTransport as jest.Mock).mockReturnValue(transporterMock);

    const module: TestingModule = await Test.createTestingModule({
      providers: [NodemailerService],
    }).compile();

    service = module.get<NodemailerService>(NodemailerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send an email', async () => {
    // Arrange
    const to = 'test@example.com';
    const subject = 'Test Subject';
    const body = 'Test Body';

    transporterMock.sendMail.mockResolvedValueOnce({ messageId: '123' });

    // Act
    await service.sendEmail(to, subject, body);

    // Assert
    expect(createTransport).toHaveBeenCalledWith({
      host: process.env.SMTP_HOST,
      port: +process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    expect(transporterMock.sendMail).toHaveBeenCalledWith({
      from: process.env.SMTP_FROM,
      to,
      subject,
      text: body,
    });
  });

  it('should throw an error if sendMail fails', async () => {
    // Arrange
    const to = 'test@example.com';
    const subject = 'Test Subject';
    const body = 'Test Body';

    const error = new Error('SendMail Error');
    transporterMock.sendMail.mockRejectedValueOnce(error);

    // Act & Assert
    await expect(service.sendEmail(to, subject, body)).rejects.toThrowError(
      'SendMail Error',
    );

    expect(transporterMock.sendMail).toHaveBeenCalledWith({
      from: process.env.SMTP_FROM,
      to,
      subject,
      text: body,
    });
  });
});
