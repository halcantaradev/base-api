import { ApiProperty } from '@nestjs/swagger';

export class VirtualPackage {
	@ApiProperty({
		description: 'Id do malote virtual',
		example: 1,
		readOnly: true,
	})
	id: number;

	@ApiProperty({
		description: 'Dados do malote físico',
		example: { codigo: 'teste' },
		readOnly: true,
	})
	malote_fisico?: { codigo: string };

	@ApiProperty({
		description: 'Identifica se o malote foi finalizado',
		example: false,
		readOnly: true,
	})
	finalizado: boolean;

	@ApiProperty({
		description: 'Condomínio do malote',
		example: { nome: 'Condomínio Teste' },
		readOnly: true,
	})
	condominio: { nome: string };

	@ApiProperty({
		description: 'Documentos do malote',
		example: [
			{
				documento: {
					id: 1,
					tipo_documento: { id: 1, nome: 'Tipo Teste' },
					discriminacao: 'Discriminação Teste',
					observacao: 'Observação Teste',
					vencimento: new Date(),
				},
			},
		],
		readOnly: true,
		isArray: true,
	})
	documentos_malote?: {
		documento: {
			id: number;
			tipo_documento?: { id: number; nome: string };
			discriminacao: string;
			observacao: string;
			vencimento: Date;
		};
	}[];
}
