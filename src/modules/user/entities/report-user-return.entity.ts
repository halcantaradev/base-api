import { ReturnEntity } from 'src/shared/entities/return.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ReportUser } from './report-user.entity';

export class ReportUserReturn extends ReturnEntity.success() {
	@ApiProperty({
		description: 'Dados que serão retornados',
		type: ReportUser,
		readOnly: true,
		required: false,
	})
	data: ReportUser;
}
