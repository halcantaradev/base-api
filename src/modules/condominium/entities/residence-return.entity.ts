import { ReturnEntity } from 'src/shared/entities/return.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Residence } from './residence.entity';

export class ResidenceReturn extends ReturnEntity.success() {
	@ApiProperty({
		description: 'Dados que serão retornados',
		type: Residence,
		readOnly: true,
		required: false,
	})
	data: Residence;
}
