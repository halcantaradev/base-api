import { ApiProperty } from '@nestjs/swagger';
import { Person } from './person.entity';

export class PersonList {
	@ApiProperty({
		description: 'Total de páginas',
		example: 1,
		readOnly: true,
	})
	total_pages: number;

	@ApiProperty({
		description: 'Lista de dados',
		type: Person,
		isArray: true,
		readOnly: true,
	})
	data: Partial<Person[]>;
}
