import { ReturnEntity } from 'src/shared/entities/return.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Company } from './company.entity';

export class CompanyReturn extends ReturnEntity.success() {
	@ApiProperty({
		description: 'Dados que serão retornados',
		type: Company,
		readOnly: true,
		required: false,
	})
	data: Company;
}
