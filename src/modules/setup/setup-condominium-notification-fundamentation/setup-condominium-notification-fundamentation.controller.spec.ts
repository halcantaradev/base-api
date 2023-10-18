import { Test, TestingModule } from '@nestjs/testing';
import { SetupCondominiumNotificationFundamentationController } from './setup-condominium-notification-fundamentation.controller';
import { SetupCondominiumNotificationFundamentationService } from './setup-condominium-notification-fundamentation.service';

describe('SetupCondominiumNotificationFundamentationController', () => {
  let controller: SetupCondominiumNotificationFundamentationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SetupCondominiumNotificationFundamentationController],
      providers: [SetupCondominiumNotificationFundamentationService],
    }).compile();

    controller = module.get<SetupCondominiumNotificationFundamentationController>(SetupCondominiumNotificationFundamentationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
