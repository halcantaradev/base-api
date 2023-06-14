import { ApiProperty } from '@nestjs/swagger';

export class UserAuth {
	id: number;

	@ApiProperty({
		description: 'Nome do usuário logado',
		example: 'John Doe',
		readOnly: true,
	})
	nome: string;

	empresa_id: number;

	cargo_id: number;
}
