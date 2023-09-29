import { Test, TestingModule } from '@nestjs/testing';
import { VirtualPackageController } from './virtual-package.controller';
import { VirtualPackageService } from './virtual-package.service';

describe('VirtualPackageController', () => {
  let controller: VirtualPackageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VirtualPackageController],
      providers: [VirtualPackageService],
    }).compile();

    controller = module.get<VirtualPackageController>(VirtualPackageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
