import { ApiProperty } from '@nestjs/swagger';
import { Condominium } from 'src/modules/condominium/entities/condominium.entity';

export class NotificationEntity {
	@ApiProperty({
		description: 'Informações da unidade',
		example: { codigo: '001' },
		required: true,
	})
	unidade: { codigo: string };

	@ApiProperty({
		description: 'Tipo da infração',
		example: { descricao: 'Animais' },
		required: true,
	})
	tipo_infracao: { descricao: string };

	@ApiProperty({
		description: 'Data da emissão',
		example: '2023-01-01T23:59:59.000Z',
		required: true,
	})
	data_emissao: Date;

	@ApiProperty({
		description: 'Data da infração',
		example: '2023-01-01T23:59:59.000Z',
		required: true,
	})
	data_infracao: Date;

	@ApiProperty({
		description: 'Número da notificação',
		example: '01/2023',
		required: true,
	})
	codigo: string;

	@ApiProperty({
		description: 'Detalhamento da notificação',
		example: 'INFRAÇÃO DE TESTE',
		required: true,
	})
	detalhes_infracao: string;

	@ApiProperty({
		description: 'Tipo de registro da notificação',
		example: 1,
		required: true,
	})
	tipo_registro: number;

	@ApiProperty({
		description: 'Fundamentação legal infrigida na notificação',
		example: 'LEI DE TESTE DO ARTIGO TESTE N° TESTE',
		required: true,
	})
	fundamentacao_legal: string;

	@ApiProperty({
		description: 'Observação da notificação',
		example: 'Observação Teste',
		required: false,
	})
	observacoes: string;

	@ApiProperty({
		description: 'Valor da multa',
		example: 1202.01,
		required: false,
	})
	valor_multa?: number;

	@ApiProperty({
		description: 'Competência da multa',
		example: '2023/01',
		required: false,
	})
	competencia_multa?: string;

	@ApiProperty({
		description: 'Unir a taxa de condomínio',
		example: true,
		required: false,
	})
	unir_taxa?: boolean;

	@ApiProperty({
		description: 'Vencimento da multa',
		example: '2023-08-01T23:59:59.000Z',
		required: false,
	})
	vencimento_multa?: Date;

	@ApiProperty({
		description: 'Id da pessoa responsável',
		example: 1,
		required: false,
	})
	pessoa_id?: number;
}
