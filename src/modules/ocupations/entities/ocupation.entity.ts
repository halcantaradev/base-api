import { ApiProperty } from '@nestjs/swagger';

export class Ocupation {
	@ApiProperty({
		description: 'Id do cargo',
		example: 1,
		required: false,
		readOnly: true,
	})
	id?: number;

	@ApiProperty({
		description: 'Nome do cargo',
		example: 'Diretor',
		required: true,
		readOnly: true,
	})
	nome: string;
}
