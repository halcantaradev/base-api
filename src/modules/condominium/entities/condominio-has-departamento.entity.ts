import { ApiProperty } from '@nestjs/swagger';

export class CondominioHasDepartamento {
	@ApiProperty({
		description: 'Id do departamento do condomínio',
		example: 1,
		required: false,
	})
	departamento_id: number;

	@ApiProperty({
		description: 'Dados do departamento do condomínio',
		example: { nome: 'Departamento Teste' },
		required: false,
	})
	departamento: { nome: string };
}
