import { ReturnEntity } from 'src/shared/entities/return.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Subsidiary } from './subsidiary.entity';

export class SubsidiaryListReturn extends ReturnEntity.success() {
	@ApiProperty({
		description: 'Dados que serão retornados',
		type: Subsidiary,
		isArray: true,
		readOnly: true,
		required: false,
	})
	data: Subsidiary[];
}
