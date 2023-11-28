import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/services/prisma/prisma.module';
import { ImportDataController } from './import-data.controller';
import { ImportDataService } from './import-data.service';

@Module({
	imports: [PrismaModule],
	controllers: [ImportDataController],
	providers: [ImportDataService],
})
export class ImportDataModule {}
