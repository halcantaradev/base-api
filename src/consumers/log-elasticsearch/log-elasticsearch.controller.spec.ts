import { Test, TestingModule } from '@nestjs/testing';
import { LogElasticsearchController } from './log-elasticsearch.controller';

describe('LogElasticsearchController', () => {
  let controller: LogElasticsearchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogElasticsearchController],
    }).compile();

    controller = module.get<LogElasticsearchController>(LogElasticsearchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
