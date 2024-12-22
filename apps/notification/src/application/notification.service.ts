import { Injectable } from '@nestjs/common';

import { EmailService } from './ports/email.service';

@Injectable()
export class NotificationService {
  constructor(private readonly emailService: EmailService) {}

  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    await this.emailService.sendEmail(to, subject, body);
  }
}
