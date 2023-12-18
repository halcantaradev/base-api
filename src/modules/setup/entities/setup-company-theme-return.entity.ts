import { ReturnEntity } from 'src/shared/entities/return.entity';
import { ApiProperty } from '@nestjs/swagger';
import { SetupCompanyTheme } from './setup-company-theme.entity';

export class SetupCompanyThemeReturn extends ReturnEntity.success() {
	@ApiProperty({
		description: 'Dados que serão retornados',
		type: SetupCompanyTheme,
		readOnly: true,
		required: false,
	})
	data: SetupCompanyTheme;
}
