import { NestFactory } from '@nestjs/core';
import { ProposalModule } from './proposal.module';

async function bootstrap() {
  const app = await NestFactory.create(ProposalModule);
  await app.listen(3000);
}
bootstrap();
