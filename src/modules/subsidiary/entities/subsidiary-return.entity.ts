import { ReturnEntity } from 'src/shared/entities/return.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Subsidiary } from './subsidiary.entity';

export class SubsidiaryReturn extends ReturnEntity.success() {
	@ApiProperty({
		description: 'Dados que serão retornados',
		type: Subsidiary,
		readOnly: true,
		required: false,
	})
	data: Subsidiary;
}
