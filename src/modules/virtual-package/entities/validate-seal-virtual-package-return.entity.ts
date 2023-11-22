import { ApiProperty } from '@nestjs/swagger';
import { ReturnEntity } from 'src/shared/entities/return.entity';

export class ValidateSealVirtualPackageListReturn extends ReturnEntity.success() {
	@ApiProperty({
		description: 'Dados que serão retornados',
		example: true,
		readOnly: true,
		required: false,
	})
	data: boolean;
}
