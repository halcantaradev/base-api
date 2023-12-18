import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateSetupCompanyThemeDto {
	@ApiProperty({
		description: 'Logo do tema',
		example: 'teste.png',
		required: false,
	})
	@IsOptional()
	@IsString({
		message:
			'A logo informada não é válida. Por favor, forneça uma logo válida',
	})
	logo?: string;

	@ApiProperty({
		description: 'Logo clara do tema',
		example: 'teste.png',
		required: false,
	})
	@IsOptional()
	@IsString({
		message:
			'A logo informada não é válida. Por favor, forneça uma logo válida',
	})
	logo_clara?: string;
}
