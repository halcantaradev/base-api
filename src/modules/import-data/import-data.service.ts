import { Injectable } from '@nestjs/common';
import { CreateImportDatumDto } from './dto/create-import-datum.dto';
import { readFile, read, utils } from 'xlsx';

@Injectable()
export class ImportDataService {
	importCondominios(createImportDatumDto: CreateImportDatumDto) {
		return { success: true };
	}

	readDataFromXlsx(file: Express.Multer.File) {
		const xlsx = read(file.buffer);
		console.log(utils.sheet_to_json(xlsx.Sheets['nacs']));
		return { success: true };
	}
}
