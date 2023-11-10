import { ApiProperty } from '@nestjs/swagger';
import { ProtocolDocument } from 'src/modules/protocol/entities/protocol-document.entity';

export class QueueGeneratePackageCondominiumList {
	@ApiProperty({
		description: 'Id do condomínio da fila',
		example: 1,
		readOnly: true,
	})
	id: number;

	@ApiProperty({
		description: 'Nome do condomínio da fila',
		example: 'Condomínio Teste',
		readOnly: true,
	})
	nome: string;

	@ApiProperty({
		description: 'Documentos da fila',
		type: ProtocolDocument,
		readOnly: true,
		isArray: true,
	})
	protocolos_documentos_condominio: ProtocolDocument[];

	@ApiProperty({
		description:
			'Identifica se está igual ou acima do limite de malotes físicos alocados no condomínio',
		example: true,
		readOnly: true,
	})
	alerta_limite_malote: boolean;
}
