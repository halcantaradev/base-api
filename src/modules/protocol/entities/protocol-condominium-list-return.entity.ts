import { ReturnEntity } from 'src/shared/entities/return.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Person } from 'src/modules/person/entities/person.entity';

export class ProtocolCondominiumListReturn extends ReturnEntity.success() {
	@ApiProperty({
		description: 'Dados que serão retornados',
		type: Person,
		isArray: true,
		readOnly: true,
		required: false,
	})
	data: Person[];
}
