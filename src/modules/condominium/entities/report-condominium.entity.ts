import { ApiProperty } from '@nestjs/swagger';
import { Condominium } from './condominium.entity';

export class ReportCondominium {
	@ApiProperty({
		description: 'Id do agrupamento',
		example: 1,
		readOnly: true,
	})
	id: number;

	@ApiProperty({
		description: 'Descrição do agrupamento',
		example: 'Agrupamento Teste',
		readOnly: true,
	})
	descricao: string;

	@ApiProperty({
		description: 'Dados que serão retornados',
		type: Condominium,
		isArray: true,
		readOnly: true,
		required: false,
	})
	data: Condominium[];
}
