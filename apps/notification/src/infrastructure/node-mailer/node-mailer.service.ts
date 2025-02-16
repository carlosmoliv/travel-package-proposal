import { createTransport, Transporter } from 'nodemailer';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

import { Injectable, Logger } from '@nestjs/common';

import { EmailService } from '../../application/ports/email.service';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class NodemailerService implements EmailService {
  private readonly logger = new Logger(NodemailerService.name);
  private transporter: Transporter;
  private oauth2Client: OAuth2Client;

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_OAUTH_CLIENT_ID,
      process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      process.env.GOOGLE_OAUTH_REDIRECT_URI,
    );
    this.oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
    });
  }

  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    try {
      const accessToken = await this.oauth2Client.getAccessToken();
      this.transporter = createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: process.env.SMTP_USER,
          clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
          clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
          refreshToken: process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
          accessToken,
        },
      } as SMTPTransport.Options);

      await this.transporter.sendMail({
        from: process.env.SMTP_FROM,
        to,
        subject,
        text: body,
      });
    } catch (e) {
      this.logger.error(e);
    }
  }
}
