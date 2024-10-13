import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { MessagePattern, Payload } from '@nestjs/microservices';

import { Permissions } from '@app/common/iam/decorators/permissions.decorator';
import { TravelPackagePermission } from '@app/common/iam/enums/travel-package.permissions.enum';

import { TravelPackageService } from '../../application/travel-package.service';
import { CreateTravelPackageDto } from '../dtos/create-travel-package.dto';

@Controller('travel-packages')
export class TravelPackageController {
  constructor(private readonly travelPackageService: TravelPackageService) {}

  @Permissions(TravelPackagePermission.CreateTravelPackage)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() createTravelPackageDto: CreateTravelPackageDto) {
    await this.travelPackageService.create(createTravelPackageDto);
  }

  @MessagePattern('travel-package.checkIfExists')
  async checkIfExists(
    @Payload() data: { travelPackageId: string },
  ): Promise<boolean> {
    return this.travelPackageService.checkIfExists(data.travelPackageId);
  }
}
