import { Injectable } from '@nestjs/common';

@Injectable()
export class TravelPackageService {
  getHello(): string {
    return 'Hello World!';
  }
}
