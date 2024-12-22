import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

import { NotificationService } from '../application/notification.service';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @EventPattern('notify.email')
  async sendEmail(
    @Payload() data: { recipient: string; message: string; proposalId: string },
  ) {
    await this.notificationService.sendEmail(
      data.recipient,
      'Payment Successful',
      data.message,
    );
  }
}
