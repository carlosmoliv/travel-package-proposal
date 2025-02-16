import { createTransport } from 'nodemailer';
import { Transporter } from 'nodemailer';

import { Test, TestingModule } from '@nestjs/testing';

import { NodemailerService } from './node-mailer.service';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';

jest.mock('nodemailer', () => ({
  createTransport: jest.fn(),
}));

describe('NodemailerService', () => {
  let service: NodemailerService;
  let transporterMock: jest.Mocked<Transporter>;
  let oauth2ClientMock: jest.Mocked<OAuth2Client>;

  beforeEach(async () => {
    transporterMock = {
      sendMail: jest.fn(),
    } as unknown as jest.Mocked<Transporter>;

    (createTransport as jest.Mock).mockReturnValue(transporterMock);

    oauth2ClientMock = {
      getAccessToken: jest.fn().mockResolvedValue('mockedAccessToken'),
      setCredentials: jest.fn(),
    } as unknown as jest.Mocked<OAuth2Client>;

    jest
      .spyOn(google.auth, 'OAuth2')
      .mockImplementation(() => oauth2ClientMock as unknown as OAuth2Client);

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
    expect(oauth2ClientMock.getAccessToken).toHaveBeenCalled();
    expect(createTransport).toHaveBeenCalledWith({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.SMTP_USER,
        clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
        clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
        accessToken: 'mockedAccessToken',
      },
    });

    expect(transporterMock.sendMail).toHaveBeenCalledWith({
      from: process.env.SMTP_FROM,
      to,
      subject,
      text: body,
    });
  });

  it('should log an error if sendMail fails', async () => {
    // Arrange
    const to = 'test@example.com';
    const subject = 'Test Subject';
    const body = 'Test Body';

    const error = new Error('SendMail Error');
    transporterMock.sendMail.mockRejectedValueOnce(error);

    const loggerSpy = jest.spyOn(service['logger'], 'error');

    // Act
    await service.sendEmail(to, subject, body);

    // Assert
    expect(transporterMock.sendMail).toHaveBeenCalled();
    expect(loggerSpy).toHaveBeenCalledWith(error);
  });
});
