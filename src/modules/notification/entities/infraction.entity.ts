import { ApiProperty } from '@nestjs/swagger';

export class Infraction {
	@ApiProperty({
		description: 'Id da infração',
		example: 1,
		required: true,
	})
	id: number;

	@ApiProperty({
		description: 'Tipo da infração',
		example: 'Animais',
		required: true,
	})
	descricao: string;
}
