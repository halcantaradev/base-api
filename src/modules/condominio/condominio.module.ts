import { Module } from '@nestjs/common';
import { CondominioService } from './condominio.service';
import { CondominioController } from './condominio.controller';
import { PessoaModule } from '../pessoa/pessoa.module';
import { PrismaService } from 'src/shared/services/prisma.service';

@Module({
	imports: [PessoaModule],
	controllers: [CondominioController],
	providers: [CondominioService, PrismaService],
})
export class CondominioModule {}
