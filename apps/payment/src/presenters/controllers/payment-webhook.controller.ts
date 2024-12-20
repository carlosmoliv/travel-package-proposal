import { Request } from 'express';

import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  RawBodyRequest,
  Req,
} from '@nestjs/common';

import { Public } from '@app/common/iam/decorators/public.decorator';

import { StripeWebhookService } from '../../infrastructure/stripe/stripe-webhook.service';

@Public()
@Controller('webhooks')
export class StripeWebhookController {
  constructor(private readonly stripeWebhookHandler: StripeWebhookService) {}

  @HttpCode(HttpStatus.OK)
  @Post('stripe')
  async handleStripeWebhook(@Req() req: RawBodyRequest<Request>) {
    const signature = req.headers['stripe-signature'] as string;
    await this.stripeWebhookHandler.handleWebhook(signature, req.rawBody);
  }
}
