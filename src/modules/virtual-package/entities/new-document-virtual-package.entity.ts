import { ApiProperty } from '@nestjs/swagger';

export class NewDocumentVirtualPackage {
	@ApiProperty({
		description: 'Id do novo documento do malote virtual',
		example: 1,
		readOnly: true,
	})
	id: number;

	@ApiProperty({
		description: 'Discriminação do novo documento do malote virtual',
		example: 'Discriminação Teste',
		readOnly: true,
	})
	discriminacao: string;

	@ApiProperty({
		description: 'Observação do novo documento do malote virtual',
		example: 'Observação Teste',
		readOnly: true,
	})
	observacao?: string;

	@ApiProperty({
		description: 'Tipo do novo documento do malote virtual',
		example: { id: 1, nome: 'Tipo Teste' },
		readOnly: true,
		isArray: true,
	})
	tipo_documento: { id: number; nome: string };
}
