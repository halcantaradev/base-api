import { Module } from '@nestjs/common';
import { ContractTypesCondominiumService } from './contract-types-condominium.service';
import { ContractTypesCondominiumController } from './contract-types-condominium.controller';
import { PrismaService } from 'src/shared/services/prisma.service';

@Module({
	controllers: [ContractTypesCondominiumController],
	providers: [ContractTypesCondominiumService, PrismaService],
})
export class ContractTypesCondominiumModule {}
