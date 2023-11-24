import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/services/prisma/prisma.module';
import { SubsidiaryController } from './subsidiary.controller';
import { SubsidiaryService } from './subsidiary.service';

@Module({
	controllers: [SubsidiaryController],
	providers: [SubsidiaryService],
	imports: [PrismaModule],
})
export class SubsidiaryModule {}
