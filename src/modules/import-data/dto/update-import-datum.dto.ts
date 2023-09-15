import { PartialType } from '@nestjs/swagger';
import { CreateImportDatumDto } from './create-import-datum.dto';

export class UpdateImportDatumDto extends PartialType(CreateImportDatumDto) {}
