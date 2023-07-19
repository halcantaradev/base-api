import { ApiProperty } from '@nestjs/swagger';

export class Infraction {
	@ApiProperty({
		description: 'Id do tipo de infração',
		example: 1,
		required: true,
	})
	id: number;

	@ApiProperty({
		description: 'Descrição do tipo de infração',
		example: 'Animais',
		required: true,
	})
	descricao: string;

	@ApiProperty({
		description: 'Status do tipo de infração',
		example: true,
		required: true,
	})
	ativo: boolean;
}
