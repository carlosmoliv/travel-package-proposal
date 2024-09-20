import { Injectable } from '@nestjs/common';

@Injectable()
export class ProposalService {
  getHello(): string {
    return 'Hello World!';
  }
}
