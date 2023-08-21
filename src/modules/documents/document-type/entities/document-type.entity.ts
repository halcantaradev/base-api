import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export class DocumentType implements Prisma.TipoDocumentoUncheckedCreateInput {
	@ApiProperty({
		description: 'ID do tipo de documento',
		example: 1,
	})
	id: number;

	@ApiProperty({
		description: 'Nome do tipo de documento',
		example: 'Boleto',
		required: true,
	})
	nome: string;

	@ApiProperty({
		description: 'Status do tipo de documento',
		example: true,
		required: true,
	})
	ativo: boolean;

	@ApiProperty({
		description: 'Data de criação do tipo de documento',
		example: new Date(),
	})
	created_at: Date;

	@ApiProperty({
		description: 'Data de atualização do tipo de documento',
		example: new Date(),
	})
	updated_at: Date;
}
