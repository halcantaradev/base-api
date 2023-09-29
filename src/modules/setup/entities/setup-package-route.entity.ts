import { ApiProperty } from '@nestjs/swagger';

export class SetupPackageRoute {
	@ApiProperty({
		description: 'Id da rota',
		example: 1,
		readOnly: true,
		required: true,
	})
	id: number;

	@ApiProperty({
		description: 'Nome da rota',
		example: 1,
		readOnly: true,
		required: true,
	})
	nome: string;
}
