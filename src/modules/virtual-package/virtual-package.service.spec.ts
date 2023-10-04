import { Test, TestingModule } from '@nestjs/testing';
import { VirtualPackageService } from './virtual-package.service';

describe('VirtualPackageService', () => {
  let service: VirtualPackageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VirtualPackageService],
    }).compile();

    service = module.get<VirtualPackageService>(VirtualPackageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
