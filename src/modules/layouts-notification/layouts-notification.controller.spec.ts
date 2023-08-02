import { Test, TestingModule } from '@nestjs/testing';
import { LayoutsNotificationController } from './layouts-notification.controller';
import { LayoutsNotificationService } from './layouts-notification.service';

describe('LayoutsNotificationController', () => {
  let controller: LayoutsNotificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LayoutsNotificationController],
      providers: [LayoutsNotificationService],
    }).compile();

    controller = module.get<LayoutsNotificationController>(LayoutsNotificationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
