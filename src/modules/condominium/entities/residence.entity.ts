import { ApiProperty } from '@nestjs/swagger';

export class Residence {
	@ApiProperty({
		description: 'Id da unidade',
		example: 1,
		readOnly: true,
	})
	id: number;

	@ApiProperty({
		description: 'Código da unidade',
		example: '001',
		readOnly: true,
	})
	codigo: string;
}
