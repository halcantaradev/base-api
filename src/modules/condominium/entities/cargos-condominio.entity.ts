import { ApiProperty } from '@nestjs/swagger';

export class CargoCondominio {
	@ApiProperty({
		description: 'Nome do cargo no condominio',
		type: String,
		example: 'Síndico',
		required: false,
	})
	nome: string;
	@ApiProperty({
		description: 'Se é síndico do condominio',
		type: String,
		example: true,
		required: false,
	})
	sindico: boolean;
}
