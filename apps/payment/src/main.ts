import { NestFactory } from '@nestjs/core';
import { PaymentModule } from './payment.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(PaymentModule, { rawBody: true });
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URI],
      queue: 'payment_queue',
    },
  });
  await app.listen(process.env.PORT);
  await app.startAllMicroservices();
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
