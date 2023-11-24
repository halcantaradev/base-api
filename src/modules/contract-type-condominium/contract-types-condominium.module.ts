import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/services/prisma/prisma.module';
import { ContractTypesCondominiumController } from './contract-types-condominium.controller';
import { ContractTypesCondominiumService } from './contract-types-condominium.service';

@Module({
	controllers: [ContractTypesCondominiumController],
	providers: [ContractTypesCondominiumService],
	imports: [PrismaModule],
})
export class ContractTypesCondominiumModule {}
