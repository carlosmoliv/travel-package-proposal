import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

import { NotificationService } from '../application/notification.service';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @EventPattern('notify.email')
  async notifyEmail(
    @Payload() data: { recipient: string; subject: string; message: string },
  ) {
    await this.notificationService.sendEmail(
      data.recipient,
      data.subject,
      data.message,
    );
  }
}
