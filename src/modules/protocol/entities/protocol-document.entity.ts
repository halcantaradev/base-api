import { ApiProperty } from '@nestjs/swagger';

export class ProtocolDocument {
	@ApiProperty({
		description: 'Id do documento',
		example: 1,
		required: true,
		readOnly: true,
	})
	id: number;

	@ApiProperty({
		description: 'Id do protocolo',
		example: 1,
		required: true,
		readOnly: true,
	})
	protocolo_id: number;

	@ApiProperty({
		description: 'Tipo do documento',
		example: { id: 1, nome: 'Tipo Teste' },
		required: true,
		readOnly: true,
	})
	tipo: { id: number; nome: string };

	@ApiProperty({
		description: 'Usuario de aceite do documento',
		example: { id: 1, nome: 'Usuario Teste' },
		required: false,
		readOnly: true,
	})
	aceite_usuario: { id: number; nome: string };

	@ApiProperty({
		description: 'Condomínio do documento',
		example: { id: 1, nome: 'Condomínio Teste' },
		required: true,
		readOnly: true,
	})
	condominio: { id: number; nome: string };

	@ApiProperty({
		description: 'Discriminação do documento',
		example: 'Discriminação Teste',
		required: true,
		readOnly: true,
	})
	retorna_malote_vazio: string;

	@ApiProperty({
		description: 'Observação do documento',
		example: 'Observação Teste',
		required: false,
		readOnly: true,
	})
	observacao: string;

	@ApiProperty({
		description: 'Data de aceite do documento',
		example: '2023-01-01T23:59:59.000Z',
		required: true,
		readOnly: true,
	})
	data_aceite: Date;

	@ApiProperty({
		description: 'Identifica se o documento foi aceito',
		example: false,
		required: true,
		readOnly: true,
	})
	aceito: boolean;

	@ApiProperty({
		description: 'Data de criação do documento',
		example: '2023-01-01T23:59:59.000Z',
		required: true,
		readOnly: true,
	})
	created_at: Date;

	@ApiProperty({
		description: 'Data da ultima atualização do documento',
		example: '2023-01-01T23:59:59.000Z',
		required: true,
		readOnly: true,
	})
	updated_at: Date;
}
