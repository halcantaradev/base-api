import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/services/prisma/prisma.module';
import { PersonModule } from '../person/person.module';
import { CondominiumController } from './condominium.controller';
import { CondominiumService } from './condominium.service';
import { TypeContractExists } from './validators';

@Module({
	imports: [PersonModule, PrismaModule],
	controllers: [CondominiumController],
	providers: [CondominiumService, TypeContractExists],
})
export class CondominiumModule {}
