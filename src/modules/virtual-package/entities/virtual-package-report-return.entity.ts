import { ApiProperty } from '@nestjs/swagger';
import { ReturnEntity } from 'src/shared/entities/return.entity';
import { VirtualPackageReport } from './virtual-package-report.entity';

export class VirtualPackageReportReturnEntity extends ReturnEntity.success() {
	@ApiProperty({
		description: 'Dados que serão retornados',
		type: VirtualPackageReport,
		isArray: true,
		readOnly: true,
		required: false,
	})
	data: VirtualPackageReport[];
}
