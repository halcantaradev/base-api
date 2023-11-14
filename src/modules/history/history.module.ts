import { Module } from '@nestjs/common';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';
import { PrismaService } from 'src/shared/services/prisma.service';

@Module({
	controllers: [HistoryController],
	providers: [HistoryService, PrismaService],
})
export class HistoryModule {}
