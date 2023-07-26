import { ApiProperty } from '@nestjs/swagger';
import { Condominium } from 'src/modules/condominium/entities/condominium.entity';

export class TiposContratoCondominio {
	@ApiProperty({
		description: 'Id do tipo de contrato',
		example: 1,
		required: true,
	})
	id?: number;

	@ApiProperty({
		description: 'Nome do tipo de contrato',
		example: 'Premium',
		required: true,
	})
	nome?: string;

	@ApiProperty({
		description: 'Status do tipo de contrato',
		example: true,
		required: true,
	})
	ativo?: boolean;

	@ApiProperty({
		description: 'Data que o registro foi criado',
		example: new Date(),
		required: true,
	})
	created_at?: Date;

	@ApiProperty({
		description: 'Data que o registro foi atualizado',
		example: new Date(),
		required: true,
	})
	updated_at?: Date;

	@ApiProperty({
		description: 'Dados do condomínio na qual o registro está associado',
		type: Condominium,
		isArray: true,
		required: true,
	})
	condominios?: Condominium[];
}
