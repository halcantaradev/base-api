import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCompanyDto {
	@ApiProperty({
		description: 'Nome da empresa',
		example: 'Empresa Teste',
		required: false,
	})
	@IsOptional()
	@IsString({
		message:
			'O campo nome informado não é válido. Por favor, forneça um valor válido',
	})
	nome?: string;

	@ApiProperty({
		description: 'CNPJ da empresa',
		example: '0000000000000000',
		required: false,
	})
	@IsOptional()
	@IsString({
		message:
			'O campo CNPJ informado não é válido. Por favor, forneça um valor válido',
	})
	cnpj?: string;

	@ApiProperty({
		description: 'Número de endereço da empresa',
		example: '0000',
		required: false,
	})
	@IsOptional()
	@IsString({
		message:
			'O campo número informado não é válido. Por favor, forneça um valor válido',
	})
	numero?: string;

	@ApiProperty({
		description: 'Endereço da empresa',
		example: 'Rua Teste',
		required: false,
	})
	@IsOptional()
	@IsString({
		message:
			'O campo endereco informado não é válido. Por favor, forneça um valor válido',
	})
	endereco?: string;

	@ApiProperty({
		description: 'CEP da empresa',
		example: '00000000',
		required: false,
	})
	@IsOptional()
	@IsString({
		message:
			'O campo CEP informado não é válido. Por favor, forneça um valor válido',
	})
	cep?: string;

	@ApiProperty({
		description: 'Bairro da empresa',
		example: 'Bairro Teste',
		required: false,
	})
	@IsOptional()
	@IsString({
		message:
			'O campo bairro informado não é válido. Por favor, forneça um valor válido',
	})
	bairro?: string;

	@ApiProperty({
		description: 'Cidade da empresa',
		example: 'Cidade Teste',
		required: false,
	})
	@IsOptional()
	@IsString({
		message:
			'O campo cidade informado não é válido. Por favor, forneça um valor válido',
	})
	cidade?: string;

	@ApiProperty({
		description: 'UF da empresa',
		example: 'CE',
		required: false,
	})
	@IsOptional()
	@IsString({
		message:
			'O campo uf informado não é válido. Por favor, forneça um valor válido',
	})
	uf?: string;
}
