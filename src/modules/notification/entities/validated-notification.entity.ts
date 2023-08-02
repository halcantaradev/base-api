import { ApiProperty } from '@nestjs/swagger';

export class ValidatedNotification {
	@ApiProperty({
		description: 'Tipo de registro da notificação',
		example: 1,
		readOnly: true,
		required: true,
	})
	tipo_registro: number;

	@ApiProperty({
		description: 'Valor da multa',
		example: 1202.01,
		readOnly: true,
		required: true,
	})
	valor_multa: number;

	@ApiProperty({
		description: 'Fundamentação legal',
		example: 'Lei 00001',
		readOnly: true,
		required: false,
	})
	fundamentacao_legal?: string | null;
}
