import { ReturnEntity } from 'src/shared/entities/return.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Infraction } from './infraction.entity';

export class ReturnInfraction extends ReturnEntity.success() {
	@ApiProperty({
		description: 'Dados que serão retornados',
		type: Infraction,
		readOnly: true,
		required: false,
	})
	data: Infraction;
}
