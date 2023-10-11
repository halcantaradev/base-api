import { ApiProperty } from '@nestjs/swagger';

export class SetupCondominiumNotificationFundamentation {
	@ApiProperty({
		description: 'Id da fundamentação com tipo de infração',
		example: 1,
		required: true,
		readOnly: true,
	})
	id: number;

	@ApiProperty({
		description: 'Id do tipo de infração relacionada',
		example: 1,
		required: true,
		readOnly: true,
	})
	tipo_infracao_id: number;

	@ApiProperty({
		description: 'Texto da fundamentação',
		example: 'Lei N 001...',
		required: true,
		readOnly: true,
	})
	fundamentacao: string;

	@ApiProperty({
		description: 'Tipo de infração',
		example: { descricao: 'Vazamento' },
		required: true,
		readOnly: true,
	})
	tipo_infracao: { descricao: string };
}
