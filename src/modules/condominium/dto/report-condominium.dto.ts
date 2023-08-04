import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ReportTypeCondominium } from '../enum/report-type-condominium.enum';
import { FiltersCondominiumDto } from './filters-condominium.dto';

export class ReportCondominiumDto {
	@ApiProperty({
		description: 'Tipo do relatório de condomínios',
		example: 'filial | responsavel | departamento',
		required: true,
	})
	@IsNotEmpty({
		message: 'O campo tipo é obrigatório. Por favor, forneça um tipo.',
	})
	@IsEnum(ReportTypeCondominium, {
		message:
			'O campo tipo informado não é válido. Por favor, forneça um código ou nome de tipo válido.',
	})
	tipo: ReportTypeCondominium;

	@ApiProperty({
		description: 'Filtro por ids de acordo com o tipo do relatório',
		type: FiltersCondominiumDto,
		required: false,
	})
	@IsOptional()
	filtros?: FiltersCondominiumDto;
}
