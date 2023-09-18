import { Module } from '@nestjs/common';
import { ImportDataService } from './import-data.service';
import { ImportDataController } from './import-data.controller';
import { PrismaService } from 'src/shared/services/prisma.service';

@Module({
	imports: [],
	controllers: [ImportDataController],
	providers: [ImportDataService, PrismaService],
})
export class ImportDataModule {}
