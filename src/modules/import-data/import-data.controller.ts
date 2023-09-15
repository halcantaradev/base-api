import {
	Body,
	Controller,
	Post,
	UploadedFiles,
	UseInterceptors,
} from '@nestjs/common';
import { CreateImportDatumDto } from './dto/create-import-datum.dto';
import { ImportDataService } from './import-data.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('import-data')
export class ImportDataController {
	constructor(private readonly importDataService: ImportDataService) {}

	@Post()
	@UseInterceptors(FilesInterceptor('xlsx', 1))
	importCondominios(
		@UploadedFiles() file: Express.Multer.File[],
		@Body() createImportDatumDto: CreateImportDatumDto,
	) {
		return this.importDataService.readDataFromXlsx(file[0]);
	}
}
