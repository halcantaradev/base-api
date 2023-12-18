import { ApiProperty } from '@nestjs/swagger';

export class SetupCompany {
	@ApiProperty({
		description: 'Id da empresa',
		example: 1,
		required: false,
	})
	id: number;

	@ApiProperty({
		description: 'Nome da empresa',
		example: 'Empresa Teste',
		required: false,
	})
	nome: string;

	@ApiProperty({
		description: 'CNPJ da empresa',
		example: '0000000000000000',
		required: false,
	})
	cnpj: string;

	@ApiProperty({
		description: 'Número de endereço da empresa',
		example: '0000',
		required: false,
	})
	numero: string;

	@ApiProperty({
		description: 'Endereço da empresa',
		example: 'Rua Teste',
		required: false,
	})
	endereco: string;

	@ApiProperty({
		description: 'CEP da empresa',
		example: '00000000',
		required: false,
	})
	cep: string;

	@ApiProperty({
		description: 'Bairro da empresa',
		example: 'Bairro Teste',
		required: false,
	})
	bairro: string;

	@ApiProperty({
		description: 'Cidade da empresa',
		example: 'Cidade Teste',
		required: false,
	})
	cidade: string;

	@ApiProperty({
		description: 'UF da empresa',
		example: 'CE',
		required: false,
	})
	uf: string;
}
