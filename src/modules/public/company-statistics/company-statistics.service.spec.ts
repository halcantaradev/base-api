import { Test, TestingModule } from '@nestjs/testing';
import { CompanyStatisticsService } from './company-statistics.service';

describe('CompanyStatisticsService', () => {
  let service: CompanyStatisticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompanyStatisticsService],
    }).compile();

    service = module.get<CompanyStatisticsService>(CompanyStatisticsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
