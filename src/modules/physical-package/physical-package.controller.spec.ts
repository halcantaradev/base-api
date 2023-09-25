import { Test, TestingModule } from '@nestjs/testing';
import { PhysicalPackageController } from './physical-package.controller';
import { PhysicalPackageService } from './physical-package.service';

describe('PhysicalPackageController', () => {
  let controller: PhysicalPackageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PhysicalPackageController],
      providers: [PhysicalPackageService],
    }).compile();

    controller = module.get<PhysicalPackageController>(PhysicalPackageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
