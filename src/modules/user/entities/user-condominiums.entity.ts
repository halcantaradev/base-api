import { ApiProperty } from '@nestjs/swagger';

export class UserCondominiums {
	@ApiProperty({
		description: 'Ids dos condomínios',
		example: [1, 2],
		isArray: true,
		required: true,
		readOnly: true,
	})
	condominios_ids: number[];

	@ApiProperty({
		description: 'Status de acesso a todos os condominios do departamento',
		example: true,
		required: true,
		readOnly: true,
	})
	acessa_todos_condominios?: boolean;
}
