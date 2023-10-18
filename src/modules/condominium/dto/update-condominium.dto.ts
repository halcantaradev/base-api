import { PartialType } from '@nestjs/swagger';
import { CreateCondominiumDto } from './create-condominium.dto';
import { IsOptional } from 'class-validator';

export class UpdateCondominiumDto extends PartialType(CreateCondominiumDto) {
	@IsOptional()
	nome?: string;
}
