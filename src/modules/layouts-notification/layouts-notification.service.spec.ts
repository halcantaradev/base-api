import { Test, TestingModule } from '@nestjs/testing';
import { LayoutsNotificationService } from './layouts-notification.service';

describe('LayoutsNotificationService', () => {
  let service: LayoutsNotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LayoutsNotificationService],
    }).compile();

    service = module.get<LayoutsNotificationService>(LayoutsNotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
