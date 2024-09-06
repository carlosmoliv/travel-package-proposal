import { NestFactory } from '@nestjs/core';
import { TravelPackageModule } from './travel-package.module';

async function bootstrap() {
  const app = await NestFactory.create(TravelPackageModule);
  await app.listen(process.env.PORT);
}
bootstrap();
