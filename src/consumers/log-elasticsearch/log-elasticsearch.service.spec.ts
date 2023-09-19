import { Test, TestingModule } from '@nestjs/testing';
import { LogElasticsearchService } from './log-elasticsearch.service';

describe('LogElasticsearchService', () => {
  let service: LogElasticsearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogElasticsearchService],
    }).compile();

    service = module.get<LogElasticsearchService>(LogElasticsearchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
