import { PartialType } from '@nestjs/swagger';
import { CreateSubsidiaryDto } from './create-subsidiary.dto';
import { IsOptional } from 'class-validator';

export class UpdateSubsidiaryDto extends PartialType(CreateSubsidiaryDto) {
	@IsOptional()
	nome?: string;
}
