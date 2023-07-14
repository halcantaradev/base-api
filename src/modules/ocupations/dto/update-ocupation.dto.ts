import { PartialType } from '@nestjs/swagger';
import { CreateOcupationDto } from './create-ocupation.dto';
import { IsOptional } from 'class-validator';

export class UpdateOcupationDto extends PartialType(CreateOcupationDto) {
	@IsOptional()
	nome: string;
}
