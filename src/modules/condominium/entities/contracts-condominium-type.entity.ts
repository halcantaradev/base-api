import { ApiProperty } from '@nestjs/swagger';

export class ContractsCondominiumType {
	@ApiProperty({
		description: 'id do contrato',
		example: 1,
		required: false,
	})
	id: number;

	@ApiProperty({
		description: 'Nome do contrato',
		example: 'Premium',
		required: false,
	})
	nome: string;

	@ApiProperty({
		description: 'Status do contrato do condomínio',
		example: true,
		required: false,
	})
	ativo: boolean;
}
