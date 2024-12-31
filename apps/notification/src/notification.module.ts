import * as Joi from 'joi';

import { Module } from '@nestjs/common';

import { NotificationController } from './presenters/notification.controller';
import { NotificationService } from './application/notification.service';
import { EmailService } from './application/ports/email.service';
import { NodemailerService } from './infrastructure/node-mailer/node-mailer.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        SMTP_USER: Joi.string().required(),
        GOOGLE_OAUTH_CLIENT_ID: Joi.string().required(),
        GOOGLE_OAUTH_CLIENT_SECRET: Joi.string().required(),
        GOOGLE_OAUTH_REFRESH_TOKEN: Joi.string().required(),
      }),
    }),
  ],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    {
      provide: EmailService,
      useClass: NodemailerService,
    },
  ],
})
export class NotificationModule {}
