import { ApiProperty } from '@nestjs/swagger';

export class UsuarioHasDepartamento {
	@ApiProperty({
		description: 'Id do departamento do usuário',
		example: 1,
		required: false,
	})
	departamento_id: number;

	@ApiProperty({
		description: 'Dados do departamento do usuário',
		example: { nome: 'Departamento Teste' },
		required: false,
	})
	departamento: { nome: string };
}
