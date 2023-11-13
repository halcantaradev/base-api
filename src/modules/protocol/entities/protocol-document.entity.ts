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
	tipo?: { id: number; nome: string };

	@ApiProperty({
		description: 'Usuario de aceite do documento',
		example: { id: 1, nome: 'Usuario Teste' },
		required: false,
		readOnly: true,
	})
	aceite_usuario?: { id: number; nome: string };

	@ApiProperty({
		description: 'Condomínio do documento',
		example: { id: 1, nome: 'Condomínio Teste' },
		required: true,
		readOnly: true,
	})
	condominio?: { id: number; nome: string };

	@ApiProperty({
		description: 'Discriminação do documento',
		example: 'Discriminação Teste',
		required: true,
		readOnly: true,
	})
	retorna_malote_vazio?: string;

	@ApiProperty({
		description: 'Observação do documento',
		example: 'Observação Teste',
		required: false,
		readOnly: true,
	})
	observacao: string;

	@ApiProperty({
		description: 'Documento retorna',
		example: true,
		required: false,
		readOnly: true,
	})
	retorna: boolean;

	@ApiProperty({
		description: 'Valor do documento',
		example: 12.34,
		required: true,
		readOnly: true,
	})
	valor: number;

	@ApiProperty({
		description: 'Data de vencimento do documento',
		example: new Date(),
		required: false,
		readOnly: true,
	})
	vencimento: Date;

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
		description: 'Identifica se o documento foi rejeitado',
		example: false,
		required: true,
		readOnly: true,
	})
	rejeitado: boolean;

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

	@ApiProperty({
		description: 'Total de anexos do documento',
		example: 2,
		required: true,
		readOnly: true,
	})
	total_anexos?: number;

	@ApiProperty({
		description: 'Total de malotes virtuais não finalizados do documento',
		example: [
			{
				malote: {
					id: 1,
					situacao: 1,
				},
			},
		],
		required: true,
		readOnly: true,
	})
	malotes_documento?: {
		malote: {
			id: number;
			situacao: number;
		};
	}[];
}
