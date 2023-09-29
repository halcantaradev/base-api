import { ApiProperty } from '@nestjs/swagger';

export class SetupPackageBiker {
	@ApiProperty({
		description: 'Id do motoqueiro',
		example: 1,
		readOnly: true,
		required: true,
	})
	id: number;

	@ApiProperty({
		description: 'Nome do motoqueiro',
		example: 1,
		readOnly: true,
		required: true,
	})
	nome: string;
}
