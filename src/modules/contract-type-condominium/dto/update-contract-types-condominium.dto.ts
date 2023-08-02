import { PartialType } from '@nestjs/swagger';
import { CreateContractTypesCondominiumDto } from './create-contract-types-condominium.dto';
import { IsOptional } from 'class-validator';

export class UpdateContractTypesCondominiumDto extends PartialType(
	CreateContractTypesCondominiumDto,
) {
	@IsOptional()
	nome?: string;

	@IsOptional()
	ativo?: boolean;
}
