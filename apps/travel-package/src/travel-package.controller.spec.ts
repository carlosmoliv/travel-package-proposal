import { Test, TestingModule } from '@nestjs/testing';
import { TravelPackageController } from './travel-package.controller';
import { TravelPackageService } from './travel-package.service';

describe('TravelPackageController', () => {
  let travelPackageController: TravelPackageController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TravelPackageController],
      providers: [TravelPackageService],
    }).compile();

    travelPackageController = app.get<TravelPackageController>(TravelPackageController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(travelPackageController.getHello()).toBe('Hello World!');
    });
  });
});
