import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { TravelPackageService } from '../../application/travel-package.service';
import { CreateTravelPackageDto } from '../dtos/create-travel-package.dto';
import { Permissions } from '@app/common/iam/authorization/decorators/permissions';
import { TravelPackagePermission } from '@app/common/iam/authorization/enums/travel-package.permissions.enum';

@Controller('travel-packages')
export class TravelPackageController {
  constructor(private readonly travelPackageService: TravelPackageService) {}

  @Permissions(TravelPackagePermission.CreateTravelPackage)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() createTravelPackageDto: CreateTravelPackageDto) {
    await this.travelPackageService.create(createTravelPackageDto);
  }
}
