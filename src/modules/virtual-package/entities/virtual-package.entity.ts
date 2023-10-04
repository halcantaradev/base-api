import { ApiProperty } from '@nestjs/swagger';
import { Condominium } from 'src/modules/condominium/entities/condominium.entity';
import { PhysicalPackage } from 'src/modules/physical-package/entities/physical-package.entity';
import { ProtocolDocument } from 'src/modules/protocol/entities/protocol-document.entity';

export class VirtualPackage {
	@ApiProperty({
		description: 'Id do malote virtual',
		example: 1,
		readOnly: true,
	})
	id: number;

	@ApiProperty({
		description: 'Id do departamento',
		example: { codigo: 1 },
		readOnly: true,
	})
	malote_fisico?: PhysicalPackage;

	@ApiProperty({
		description: 'Finalizado',
		example: false,
		readOnly: true,
	})
	finalizado: boolean;

	@ApiProperty({
		description: 'Finalizado',
		example: { nome: 'Teste' },
		readOnly: true,
	})
	condominio: Condominium;

	@ApiProperty({
		description: 'Finalizado',
		readOnly: true,
		isArray: true,
	})
	documentos_malote: ProtocolDocument;
}
