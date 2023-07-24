import { Test, TestingModule } from '@nestjs/testing';
import { ExternalAccessDocumentsController } from './external-access-documents.controller';
import { ExternalAccessDocumentsService } from './external-access-documents.service';

describe('ExternalAccessDocumentsController', () => {
  let controller: ExternalAccessDocumentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExternalAccessDocumentsController],
      providers: [ExternalAccessDocumentsService],
    }).compile();

    controller = module.get<ExternalAccessDocumentsController>(ExternalAccessDocumentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
