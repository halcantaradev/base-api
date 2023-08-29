import { ApiProperty } from '@nestjs/swagger';

export class Protocol {
	@ApiProperty({
		description: 'Id do protocolo',
		example: 1,
		required: true,
		readOnly: true,
	})
	id: number;

	@ApiProperty({
		description: 'Tipo do protocolo',
		example: 1,
		required: true,
		readOnly: true,
	})
	tipo: 1 | 2;

	@ApiProperty({
		description: 'Usuario de origem do protocolo',
		example: { id: 1, nome: 'Usuario Teste' },
		required: true,
		readOnly: true,
	})
	origem_usuario: { id: number; nome: string };

	@ApiProperty({
		description: 'Departamento de origem do protocolo',
		example: { id: 1, nome: 'Departamento Teste' },
		required: true,
		readOnly: true,
	})
	origem_departamento: { id: number; nome: string };

	@ApiProperty({
		description: 'Usuario de destino do protocolo',
		example: { id: 1, nome: 'Usuario Teste' },
		required: true,
		readOnly: true,
	})
	destino_usuario: { id: number; nome: string };

	@ApiProperty({
		description: 'Departamento de destino do protocolo',
		example: { id: 1, nome: 'Departamento Teste' },
		required: true,
		readOnly: true,
	})
	destino_departamento: { id: number; nome: string };

	@ApiProperty({
		description: 'Identifica se o protocolo retorna malote vazio',
		example: false,
		required: true,
		readOnly: true,
	})
	retorna_malote_vazio: boolean;

	@ApiProperty({
		description: 'Status do protocolo',
		example: true,
		required: true,
		readOnly: true,
	})
	ativo: boolean;

	@ApiProperty({
		description: 'Identifica se o protocolo foi finalizado',
		example: false,
		required: true,
		readOnly: true,
	})
	finalizado: boolean;

	@ApiProperty({
		description: 'Data de criação do protocolo',
		example: '2023-01-01T23:59:59.000Z',
		required: true,
		readOnly: true,
	})
	created_at: Date;

	@ApiProperty({
		description: 'Data da ultima atualização do protocolo',
		example: '2023-01-01T23:59:59.000Z',
		required: true,
		readOnly: true,
	})
	updated_at: Date;
}