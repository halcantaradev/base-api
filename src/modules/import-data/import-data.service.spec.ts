import { Test, TestingModule } from '@nestjs/testing';
import { ImportDataService } from './import-data.service';

describe('ImportDataService', () => {
  let service: ImportDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImportDataService],
    }).compile();

    service = module.get<ImportDataService>(ImportDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
