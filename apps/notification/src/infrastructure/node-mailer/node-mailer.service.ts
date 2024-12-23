import { createTransport, Transporter } from 'nodemailer';

import { Injectable } from '@nestjs/common';

import { EmailService } from '../../application/ports/email.service';

@Injectable()
export class NodemailerService implements EmailService {
  private readonly transporter: Transporter;

  constructor() {
    this.transporter = createTransport({
      host: process.env.SMTP_HOST,
      port: +process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      text: body,
    });
  }
}
