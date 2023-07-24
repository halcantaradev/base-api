import { Test, TestingModule } from '@nestjs/testing';
import { ExternalAccessDocumentsService } from './external-access-documents.service';

describe('ExternalAccessDocumentsService', () => {
  let service: ExternalAccessDocumentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExternalAccessDocumentsService],
    }).compile();

    service = module.get<ExternalAccessDocumentsService>(ExternalAccessDocumentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
