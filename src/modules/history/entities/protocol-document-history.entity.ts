import { ApiProperty } from '@nestjs/swagger';

export class ProtocolDocumentHistory {
	@ApiProperty({
		description: 'Id do registro',
		example: 1,
		readOnly: true,
	})
	id: number;

	@ApiProperty({
		description: 'Dados do usuario do registro',
		example: { id: 1, nome: 'USUÁRIO TESTE' },
		readOnly: true,
	})
	usuario: { id: number; nome: string };

	@ApiProperty({
		description: 'Situação do registro',
		example: 1,
		readOnly: true,
	})
	situacao: number;

	@ApiProperty({
		description: 'Descrição do registro',
		example: 'Descrição Teste',
		readOnly: true,
	})
	descricao: number;

	@ApiProperty({
		description: 'Data que o registro foi criado',
		example: new Date(),
		required: true,
	})
	created_at: Date;
}
