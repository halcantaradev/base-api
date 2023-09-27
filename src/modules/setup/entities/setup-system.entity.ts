import { ApiProperty } from '@nestjs/swagger';

export class SetupSystem {
	@ApiProperty({
		description: 'Salário minimo base para cálculos no sistema',
		example: 1506.65,
		required: true,
	})
	salario_minimo_base: number;

	@ApiProperty({
		description: 'Texto padrão a ser exibido na notificação',
		example: 'Teste teste teste teste',
		required: true,
	})
	texto_padrao_notificacao: string;

	@ApiProperty({
		description: 'Texto da sanção',
		example: 'Teste teste teste teste',
		required: true,
	})
	sancao: string;

	@ApiProperty({
		description: 'Status de uso de malotes físicos',
		example: true,
		required: false,
	})
	usa_malote_fisico: boolean;
}
