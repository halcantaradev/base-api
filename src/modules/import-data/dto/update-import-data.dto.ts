import { PartialType } from '@nestjs/swagger';
import { CreateImportDataDto } from './create-import-data.dto';

export class UpdateImportDataDto extends PartialType(CreateImportDataDto) {}
