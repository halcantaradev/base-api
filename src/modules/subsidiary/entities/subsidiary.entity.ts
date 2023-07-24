import { ApiProperty } from '@nestjs/swagger';

export class Subsidiary {
	@ApiProperty({
		description: 'Id da filial',
		example: 1,
		readOnly: true,
	})
	id: number;

	@ApiProperty({
		description: 'Nome da filial',
		example: 'Departamento Teste',
		readOnly: true,
	})
	nome: string;

	@ApiProperty({
		description: 'Status da filial',
		example: true,
		readOnly: true,
	})
	ativo: boolean;
}
