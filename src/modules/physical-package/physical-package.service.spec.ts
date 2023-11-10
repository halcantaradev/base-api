import { Test, TestingModule } from '@nestjs/testing';
import { PhysicalPackageService } from './physical-package.service';

describe('PhysicalPackageService', () => {
  let service: PhysicalPackageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PhysicalPackageService],
    }).compile();

    service = module.get<PhysicalPackageService>(PhysicalPackageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
