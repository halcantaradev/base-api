import { ApiProperty } from '@nestjs/swagger';

export class Department {
	@ApiProperty({
		description: 'Id do departamento',
		example: 1,
		readOnly: true,
	})
	id: number;

	@ApiProperty({
		description: 'Id da filial do departamento',
		example: { id: 1, nome: 'FILIAL TESTE' },
		readOnly: true,
	})
	filial: { id: number; nome: string };

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

	@ApiProperty({
		description: 'Status do departamento',
		example: true,
		readOnly: true,
	})
	ativo: boolean;
}
