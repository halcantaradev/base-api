import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class ReceivePackageVirtualPackageDto {
	@ApiProperty({
		description: 'Id dos malotes',
		example: [1, 2],
		required: true,
	})
	@IsInt({
		each: true,
		message:
			'Os malotes informado não são válidos. Por favor, forneça malotes válidos.',
	})
	@IsNotEmpty({
		message:
			'O campo de malotes é obrigatório. Por favor, forneça um documento.',
	})
	malotes_virtuais_ids: number[];
}
