import { Test, TestingModule } from '@nestjs/testing';
import { OcupationsController } from './ocupations.controller';
import { OcupationsService } from './ocupations.service';

describe('OcupationsController', () => {
  let controller: OcupationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OcupationsController],
      providers: [OcupationsService],
    }).compile();

    controller = module.get<OcupationsController>(OcupationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
