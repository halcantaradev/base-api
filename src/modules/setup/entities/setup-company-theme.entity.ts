import { ApiProperty } from '@nestjs/swagger';

export class SetupCompanyTheme {
	@ApiProperty({
		description: 'Logo do tema',
		example: 'teste.png',
		required: false,
	})
	logo: string | null;

	@ApiProperty({
		description: 'Logo clara do tema',
		example: 'teste.png',
		required: false,
	})
	logo_clara: string | null;
}
