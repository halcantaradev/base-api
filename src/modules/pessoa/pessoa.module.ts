import { Module } from '@nestjs/common';
import { PessoaService } from './pessoa.service';
import { PessoaController } from './pessoa.controller';
import { PrismaService } from 'src/shared/services/prisma.service';

@Module({
	controllers: [PessoaController],
	providers: [PessoaService, PrismaService],
	exports: [PessoaService],
})
export class PessoaModule {}
