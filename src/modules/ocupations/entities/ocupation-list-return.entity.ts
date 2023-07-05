import { ReturnEntity } from 'src/shared/entities/return.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Ocupation } from './ocupation.entity';

export class OcupationListReturn extends ReturnEntity.success() {
	@ApiProperty({
		description: 'Dados que serão retornados',
		type: Ocupation,
		isArray: true,
		readOnly: true,
		required: false,
	})
	data: Ocupation[];
}
