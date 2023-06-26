import { ApiProperty } from '@nestjs/swagger';

export class Department {
	@ApiProperty({
		description: 'Id do departamento',
		example: 1,
		readOnly: true,
	})
	id: number;

	@ApiProperty({
		description: 'Nome do departamento',
		example: 'Departamento Teste',
		readOnly: true,
	})
	nome: string;

	@ApiProperty({
		description: 'Departamento é um NAC',
		example: true,
		readOnly: true,
	})
	nac: boolean;
}
