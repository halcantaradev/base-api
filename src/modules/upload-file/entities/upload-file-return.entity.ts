import { ReturnEntity } from 'src/shared/entities/return.entity';
import { ApiProperty } from '@nestjs/swagger';
import { File } from 'src/shared/entities/file.entity';

export class UploadFileReturn extends ReturnEntity.success() {
	@ApiProperty({
		description: 'Dados que serão retornados',
		type: File,
		isArray: true,
		readOnly: true,
		required: false,
	})
	data: File[];
}
