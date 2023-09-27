import { PartialType } from '@nestjs/swagger';
import { CreatePhysicalPackageDto } from './create-physical-package.dto';
import { IsOptional } from 'class-validator';

export class UpdatePhysicalPackageDto extends PartialType(
	CreatePhysicalPackageDto,
) {
	@IsOptional()
	codigo?: string;

	@IsOptional()
	alerta?: boolean;

	@IsOptional()
	disponivel?: boolean;

	@IsOptional()
	empresa_id?: number;

	@IsOptional()
	excluido?: boolean;
}
