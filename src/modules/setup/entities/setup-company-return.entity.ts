import { ReturnEntity } from 'src/shared/entities/return.entity';
import { ApiProperty } from '@nestjs/swagger';
import { SetupCompany } from './setup-company.entity';

export class SetupCompanyReturn extends ReturnEntity.success() {
	@ApiProperty({
		description: 'Dados que serão retornados',
		type: SetupCompany,
		readOnly: true,
		required: false,
	})
	data: SetupCompany;
}
