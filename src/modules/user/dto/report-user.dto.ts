import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ReportTypeUser } from '../enum/report-type-user.enum';
import { ListUserDto } from './list-user.dto';

export class ReportUserDto {
	@ApiProperty({
		description: 'Tipo do relatório',
		example: 'responsavel',
		required: true,
	})
	@IsNotEmpty({
		message: 'O campo tipo é obrigatório. Por favor, forneça um tipo.',
	})
	@IsEnum(ReportTypeUser, {
		message:
			'O campo tipo informado não é válido. Por favor, forneça um código ou nome de tipo válido.',
	})
	tipo: ReportTypeUser;

	@ApiProperty({
		description: 'Filtro por ids de acordo com o tipo do relatório',
		type: ListUserDto,
		required: false,
	})
	@IsOptional()
	filtros?: ListUserDto;
}
