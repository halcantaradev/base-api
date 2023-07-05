import { ApiProperty } from '@nestjs/swagger';

export class SetupNotification {
	@ApiProperty({
		description: 'Regra aplicada para 1ª reincidência',
		example: true,
		readOnly: true,
		required: true,
	})
	primeira_reincidencia: boolean;

	@ApiProperty({
		description: 'Taxa base aplicada na 1ª reincidência',
		example: 1,
		readOnly: true,
		required: true,
	})
	primeira_reincidencia_base_pagamento: number;

	@ApiProperty({
		description: 'Percentual sobre a taxa base aplicada na 1ª reincidência',
		example: 50,
		readOnly: true,
		required: true,
	})
	primeira_reincidencia_percentual_pagamento: number;

	@ApiProperty({
		description: 'Regra aplicada para 2ª reincidência',
		example: true,
		readOnly: true,
		required: true,
	})
	segunda_reincidencia: boolean;

	@ApiProperty({
		description: 'Taxa base aplicada na 2ª reincidência',
		example: 1,
		readOnly: true,
		required: true,
	})
	segunda_reincidencia_base_pagamento: number;

	@ApiProperty({
		description: 'Dias para uma unidade recorrer sobre notificação',
		example: 15,
		readOnly: true,
		required: true,
	})
	prazo_interpor_recurso: number;

	@ApiProperty({
		description: 'Obsevações padrões aplicadas em todas as notificações',
		example: 'Observação de teste',
		readOnly: true,
		required: true,
	})
	observacoes: string;
}
