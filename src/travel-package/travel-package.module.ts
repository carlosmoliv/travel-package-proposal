import { Module } from '@nestjs/common';
import { TravelPackageService } from './application/travel-package.service';

@Module({
  providers: [TravelPackageService],
})
export class TravelPackageModule {}
