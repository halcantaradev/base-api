import { Module } from '@nestjs/common';
import { CompanyStatisticsService } from './company-statistics.service';
import { CompanyStatisticsController } from './company-statistics.controller';
import { PrismaModule } from 'src/shared/services/prisma/prisma.module';

@Module({
	imports: [PrismaModule],
	controllers: [CompanyStatisticsController],
	providers: [CompanyStatisticsService],
})
export class CompanyStatisticsModule {}
