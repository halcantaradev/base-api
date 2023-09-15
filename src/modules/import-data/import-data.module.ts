import { Module } from '@nestjs/common';
import { ImportDataService } from './import-data.service';
import { ImportDataController } from './import-data.controller';

@Module({
  controllers: [ImportDataController],
  providers: [ImportDataService]
})
export class ImportDataModule {}
