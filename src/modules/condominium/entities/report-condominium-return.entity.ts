import { ReturnEntity } from 'src/shared/entities/return.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ReportCondominium } from './report-condominium.entity';

export class ReportCondominiumReturn extends ReturnEntity.success() {
	@ApiProperty({
		description: 'Dados que serão retornados',
		type: ReportCondominium,
		readOnly: true,
		required: false,
	})
	data: ReportCondominium;
}
