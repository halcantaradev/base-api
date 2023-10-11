import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsInt } from 'class-validator';
import { Prisma } from './../../../../node_modules/.prisma/client/index.d';
import { Transform } from 'class-transformer';
import { BooleanTransformHelper } from 'src/shared/helpers/boolean.helper';
export class CreateCondominiumDto implements Prisma.PessoaCreateManyInput {
	@ApiProperty({
		description: 'Nome do condomínio',
		example: 'Condomínio 1',
		required: true,
	})
	@IsString({
		message:
			'O campo nome informado não é válido. Por favor, forneça um nome válido.',
	})
	@IsNotEmpty({
		message: 'O campo nome é obrigatório. Por favor, forneça um nome .',
	})
	nome: string;

	@ApiProperty({
		description: 'CNPJ do condomínio',
		example: '12345678901234',
		required: true,
	})
	@IsString({
		message:
			'O campo cnpj informado não é válido. Por favor, forneça um cnpj válido.',
	})
	@IsOptional()
	cnpj?: string;

	@ApiProperty({
		description: 'Id da empresa',
		example: 1,
	})
	@IsInt({
		message:
			'O campo empresa informado não é válido. Por favor, forneça uma empresa válida.',
	})
	@IsOptional()
	empresa_id?: number;

	@ApiProperty({
		description: 'Id do tipo de contrato',
		example: [1, 2],
	})
	@IsInt({
		each: true,
		message:
			'O campo tipo de contrato informado não é válido. Por favor, forneça um tipo de contrato válido.',
	})
	@IsOptional()
	tipos_contratos_ids?: number[];

	@ApiProperty({
		description: 'Id do departamento',
		example: 1,
	})
	@IsInt({
		message:
			'O campo id do departamento informado não é valido. Por favor, forneça um id do valido.',
	})
	@IsOptional()
	departamento_id?: number;

	@ApiProperty({
		description: 'Número do condomínio',
		example: 1,
	})
	@IsString({
		message:
			'O campo numero informado não é válido. Por favor, forneça um numero válido.',
	})
	@IsOptional()
	numero?: string;

	@ApiProperty({
		description: 'Endereço do condomínio',
		example: 'Av. Teste, 123',
		required: false,
	})
	@IsString({
		message:
			'O campo endereço informado não é válido. Por favor, forneça um endereço válido.',
	})
	@IsOptional()
	endereco?: string;

	@ApiProperty({
		description: 'CEP do condomínio',
		example: '12345678',
		required: false,
	})
	@IsString({
		message:
			'O campo cep informado não é valido. Por favor, forneça um cep.',
	})
	@IsOptional()
	cep?: string;

	@ApiProperty({
		description: 'Bairro do condomínio',
		example: 'Bairro Teste',
		required: false,
	})
	@IsString({
		message:
			'O campo bairro informado não é valido. Por favor, forneça um bairro.',
	})
	@IsOptional()
	bairro?: string;

	@ApiProperty({
		description: 'Cidade do condomínio',
		example: 'Cidade Teste',
	})
	@IsString({
		message:
			'O campo cidade informado não é válido. Por favor, forneça uma cidade válida.',
	})
	@IsOptional()
	cidade?: string;

	@ApiProperty({
		description: 'Estado do condomínio',
		example: 'SP',
		required: false,
	})
	@IsString({
		message:
			'O campo estado informado não é válido. Por favor, forneça um estado.',
	})
	@IsOptional()
	uf?: string;

	@ApiProperty({
		description: 'Id da categoria',
		example: 1,
		required: false,
	})
	@IsInt({
		message:
			'O campo categoria informado não é válido. Por favor, forneça uma categoria válida.',
	})
	@IsOptional()
	categoria_id?: number;

	@ApiProperty({
		description: 'Importado do condomínio',
		example: true,
		required: false,
	})
	@IsOptional()
	@Transform(BooleanTransformHelper)
	importado?: boolean;

	@ApiProperty({
		description: 'Status do condomínio',
		example: true,
		required: false,
	})
	@Transform(BooleanTransformHelper)
	@IsOptional()
	ativo?: boolean;
}
