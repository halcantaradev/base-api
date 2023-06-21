import { ApiProperty } from '@nestjs/swagger';

export class Person {
	@ApiProperty({
		description: 'Id do objeto referente',
		example: 1,
		readOnly: true,
	})
	id: number;

	@ApiProperty({
		description: 'Nome do objeto referente',
		example: 'Nome Teste',
		readOnly: true,
	})
	nome: string;

	@ApiProperty({
		description: 'CNPJ do objeto referente',
		example: '42402549000125',
		readOnly: true,
	})
	cnpj: string;

	@ApiProperty({
		description: 'Endereco do objeto referente',
		example: 'Av. Teste',
		readOnly: true,
	})
	endereco?: string;

	@ApiProperty({
		description: 'Cep do objeto referente',
		example: '60000000',
		readOnly: true,
	})
	cep?: string;

	@ApiProperty({
		description: 'Bairro do objeto referente',
		example: 'Bairro Teste',
		readOnly: true,
	})
	bairro?: string;

	@ApiProperty({
		description: 'Cidade do objeto referente',
		example: 'Cidade Teste',
		readOnly: true,
	})
	cidade?: string;

	@ApiProperty({
		description: 'UF do objeto referente',
		example: 'TS',
		readOnly: true,
	})
	uf?: string;

	@ApiProperty({
		description: 'Status do objeto referente',
		example: true,
		readOnly: true,
	})
	ativa: boolean;

	@ApiProperty({
		description: 'Informações de contato do objeto referente',
		example: [{ contato: 'contato@teste.com' }],
		isArray: true,
		readOnly: true,
	})
	contato: { contato: string }[];
}
