import { ApiProperty } from '@nestjs/swagger';

export class ProtocolDocumentHistorySituation {
	@ApiProperty({
		description: 'Id da situacao',
		example: 1,
		readOnly: true,
	})
	id: number;

	@ApiProperty({
		description: 'Descrição da situacao',
		example: 'Descrição Teste',
		readOnly: true,
	})
	descricao: string;

	@ApiProperty({
		description: 'Cor para a situacao',
		example: 'green',
		readOnly: true,
	})
	cor: string;

	@ApiProperty({
		description: 'Icone para a situacao',
		example: 'send',
		readOnly: true,
	})
	icone: string;
}
