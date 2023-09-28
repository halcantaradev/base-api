import { ApiProperty } from '@nestjs/swagger';

export class SetupPackageDriver {
	@ApiProperty({
		description: 'Id do motorista',
		example: 1,
		readOnly: true,
		required: true,
	})
	id: number;

	@ApiProperty({
		description: 'Nome do motorista',
		example: 1,
		readOnly: true,
		required: true,
	})
	nome: string;
}
