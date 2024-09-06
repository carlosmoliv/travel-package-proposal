import { Controller, Get } from '@nestjs/common';
import { TravelPackageService } from './travel-package.service';

@Controller()
export class TravelPackageController {
  constructor(private readonly travelPackageService: TravelPackageService) {}

  @Get()
  getHello(): string {
    return this.travelPackageService.getHello();
  }
}
