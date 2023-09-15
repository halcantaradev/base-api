import { Test, TestingModule } from '@nestjs/testing';
import { ImportDataController } from './import-data.controller';
import { ImportDataService } from './import-data.service';

describe('ImportDataController', () => {
  let controller: ImportDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImportDataController],
      providers: [ImportDataService],
    }).compile();

    controller = module.get<ImportDataController>(ImportDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
