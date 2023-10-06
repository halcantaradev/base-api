import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsDateString, IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { VirtualPackageType } from 'src/shared/consts/report-virtual-package-tyoe.const';
import { BooleanTransformHelper } from 'src/shared/helpers/boolean.helper';

export class FiltersVirtualPackageDto {
	@ApiProperty({
		description: 'Tipo de relatório',
		enum: VirtualPackageType,
		example: Object.values(VirtualPackageType),
		required: false,
	})
	@IsNotEmpty({
		each: true,
		message:
			'O campo tipo de relatório informado não é válido. Por favor, forneça um tipo válido.',
	})
	@IsInt({
		message:
			'O campo tipo de relatório informado não é válido. Por favor, forneça um tipo válido.',
	})
	@Type(() => Number)
	tipo: number;

	@ApiProperty({
		description: 'Filtro da situação do malote',
		example: 1,
		required: false,
	})
	@IsOptional()
	situacao?: boolean;

	@ApiProperty({
		description: 'Filtro por condomínio do malote',
		example: 1,
		required: false,
	})
	@IsOptional()
	@IsInt({
		each: true,
		message:
			'O campo condomínio informado não é válido. Por favor, forneça um condomínio válido.',
	})
	condominios_ids?: number[];

	@ApiProperty({
		description: 'Filtro por data de emissão do malote',
		example: [new Date(), new Date()],
		required: false,
	})
	@IsOptional()
	@IsDateString(
		{},
		{
			each: true,
			message: 'Data inválida, por favor, informe uma data válida',
		},
	)
	data_emissao?: string[];

	@ApiProperty({
		description: 'Filtro por malote físico do malote',
		example: 1,
		required: false,
	})
	@IsOptional()
	@IsInt({
		each: true,
		message:
			'O campo malote físico informado não é válido. Por favor, forneça um malote físico válido.',
	})
	malote_fisico_ids?: number[];

	@ApiProperty({
		description: 'Filtro por código do malote',
		example: 1,
		required: false,
	})
	@IsOptional()
	@IsInt({
		message:
			'O campo código informado não é válido. Por favor, forneça um código válido.',
	})
	codigo?: number;

	@ApiProperty({
		description: 'Filtro por data de retorno do malote',
		example: [new Date(), new Date()],
		required: false,
	})
	@IsOptional()
	@IsDateString(
		{},
		{
			each: true,
			message: 'Data inválida, por favor, informe uma data válida',
		},
	)
	data_retorno?: string[];

	@ApiProperty({
		description: 'Filtro por documento retornado do malote',
		example: true,
		required: false,
	})
	@IsOptional()
	@Transform(BooleanTransformHelper)
	documento_retorna?: boolean;
}
