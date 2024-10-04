import { NestFactory } from '@nestjs/core';
import { TravelPackageModule } from './travel-package.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(TravelPackageModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URI],
      queue: 'travel_package_queue',
    },
  });

  await app.listen(process.env.PORT);
  await app.startAllMicroservices();
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
