import { PartialType } from '@nestjs/swagger';
import { CreateTiposContratoCondominioDto } from './create-tipos-contrato-condominio.dto';
import { IsOptional } from 'class-validator';

export class UpdateTiposContratoCondominioDto extends PartialType(
	CreateTiposContratoCondominioDto,
) {
	@IsOptional()
	nome?: string;

	@IsOptional()
	ativo?: boolean;
}
