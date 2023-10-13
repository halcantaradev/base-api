import { ApiProperty } from '@nestjs/swagger';
import { Condominium } from 'src/modules/condominium/entities/condominium.entity';
import { ProtocolDocument } from 'src/modules/protocol/entities/protocol-document.entity';

export class VirtualPackageReport {
	@ApiProperty({
		description: 'Código do malote',
		example: { codigo: '000002' },
		readOnly: true,
	})
	malote_fisico?: { codigo: string };

	@ApiProperty({
		description: 'Condomínio do malote',
		example: { id: 1, nome: 'Teste' },
		readOnly: true,
	})
	condominio: Condominium;

	@ApiProperty({
		description: 'Data da saída do malote',
		example: new Date(),
		readOnly: true,
	})
	data_saida: string;

	@ApiProperty({
		description: 'Data do retorno do malote',
		example: new Date(),
		readOnly: true,
	})
	data_retorno: string;

	@ApiProperty({
		description: 'Documentos do malote',
		type: ProtocolDocument,
		readOnly: true,
		isArray: true,
	})
	documentos_malote: ProtocolDocument[];
}
