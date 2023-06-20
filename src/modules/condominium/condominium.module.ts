import { Module } from '@nestjs/common';
import { CondominiumService } from './condominium.service';
import { CondominiumController } from './condominium.controller';
import { PersonModule } from '../person/person.module';
import { PrismaService } from 'src/shared/services/prisma.service';

@Module({
	imports: [PersonModule],
	controllers: [CondominiumController],
	providers: [CondominiumService, PrismaService],
})
export class CondominiumModule {}
