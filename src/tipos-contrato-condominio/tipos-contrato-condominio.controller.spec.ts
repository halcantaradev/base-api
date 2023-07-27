import { Test, TestingModule } from '@nestjs/testing';
import { TiposContratoCondominioController } from './tipos-contrato-condominio.controller';
import { TiposContratoCondominioService } from './tipos-contrato-condominio.service';

describe('TiposContratoCondominioController', () => {
  let controller: TiposContratoCondominioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TiposContratoCondominioController],
      providers: [TiposContratoCondominioService],
    }).compile();

    controller = module.get<TiposContratoCondominioController>(TiposContratoCondominioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
