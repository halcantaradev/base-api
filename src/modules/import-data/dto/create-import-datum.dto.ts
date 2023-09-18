import { ApiProperty } from '@nestjs/swagger';
import { File } from 'buffer';
import { IsNotEmpty } from 'class-validator';

export class CreateImportDatumDto {
	@ApiProperty({
		description: 'Arquivo para ser importado',
		required: true,
		type: File,
		isArray: true,
	})
	@IsNotEmpty({
		message: 'O campo nome é obrigatório. Por favor, forneça um arquivo.',
	})
	import: Express.Multer.File[];
}
