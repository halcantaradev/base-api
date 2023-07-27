import { Module } from '@nestjs/common';
import { TiposContratoCondominioService } from './tipos-contrato-condominio.service';
import { TiposContratoCondominioController } from './tipos-contrato-condominio.controller';
import { PrismaService } from 'src/shared/services/prisma.service';

@Module({
	controllers: [TiposContratoCondominioController],
	providers: [TiposContratoCondominioService, PrismaService],
})
export class TiposContratoCondominioModule {}
