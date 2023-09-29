import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class FilterQueueGeneratePackageDto {
	@ApiProperty({
		description: 'ID da rota',
		example: 1,
		required: false,
	})
	@IsOptional()
	rota_dia_semana: number;
}
