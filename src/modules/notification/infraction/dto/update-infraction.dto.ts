import { IsOptional } from 'class-validator';
import { CreateInfractionDto } from './create-infraction.dto';

export class UpdateInfractionDto extends CreateInfractionDto {
	@IsOptional()
	descricao: string;

	@IsOptional()
	fundamentacao_legal: string;

	@IsOptional()
	ativo: boolean;
}
