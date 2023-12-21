import { Test, TestingModule } from '@nestjs/testing';
import { CompanyStatisticsController } from './company-statistics.controller';
import { CompanyStatisticsService } from './company-statistics.service';

describe('CompanyStatisticsController', () => {
  let controller: CompanyStatisticsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyStatisticsController],
      providers: [CompanyStatisticsService],
    }).compile();

    controller = module.get<CompanyStatisticsController>(CompanyStatisticsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
