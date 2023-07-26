import { Test, TestingModule } from '@nestjs/testing';
import { TiposContratoCondominioService } from './tipos-contrato-condominio.service';

describe('TiposContratoCondominioService', () => {
  let service: TiposContratoCondominioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TiposContratoCondominioService],
    }).compile();

    service = module.get<TiposContratoCondominioService>(TiposContratoCondominioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
