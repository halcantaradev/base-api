import { Test, TestingModule } from '@nestjs/testing';
import { SetupCondominiumNotificationFundamentationService } from './setup-condominium-notification-fundamentation.service';

describe('SetupCondominiumNotificationFundamentationService', () => {
  let service: SetupCondominiumNotificationFundamentationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SetupCondominiumNotificationFundamentationService],
    }).compile();

    service = module.get<SetupCondominiumNotificationFundamentationService>(SetupCondominiumNotificationFundamentationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
