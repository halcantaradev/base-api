import { Test, TestingModule } from '@nestjs/testing';
import { QueueGeneratePackageService } from './queue-generate-package.service';

describe('QueueGeneratePackageService', () => {
  let service: QueueGeneratePackageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QueueGeneratePackageService],
    }).compile();

    service = module.get<QueueGeneratePackageService>(QueueGeneratePackageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
