import { ApiProperty } from '@nestjs/swagger';
import { QueueGeneratePackageCondominiumList } from './queue-generate-package-condimium-list';
import { ReturnEntity } from 'src/shared/entities/return.entity';

export class QueueGeneratePackageReturn extends ReturnEntity.success() {
	@ApiProperty({
		description: 'Dados que serão retornados',
		type: QueueGeneratePackageCondominiumList,
		isArray: true,
		readOnly: true,
		required: false,
	})
	data: QueueGeneratePackageCondominiumList[];
}
