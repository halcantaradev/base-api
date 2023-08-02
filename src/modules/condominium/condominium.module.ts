import { Module } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { PersonModule } from '../person/person.module';
import { CondominiumController } from './condominium.controller';
import { CondominiumService } from './condominium.service';
import { DepartmentExists, TypeContractExists } from './validators';

@Module({
	imports: [PersonModule],
	controllers: [CondominiumController],
	providers: [
		CondominiumService,
		PrismaService,
		DepartmentExists,
		TypeContractExists,
	],
})
export class CondominiumModule {}
