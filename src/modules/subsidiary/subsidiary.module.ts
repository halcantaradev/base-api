import { Module } from '@nestjs/common';
import { SubsidiaryService } from './subsidiary.service';
import { SubsidiaryController } from './subsidiary.controller';
import { PrismaService } from 'src/shared/services/prisma.service';

@Module({
	controllers: [SubsidiaryController],
	providers: [SubsidiaryService, PrismaService],
})
export class SubsidiaryModule {}
