import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, Validate } from 'class-validator';
import { BooleanTransformHelper } from 'src/shared/helpers/boolean.helper';
import { IsBooleanType } from 'src/shared/validators';

export class ReceiveVirtualPackageDto {
	@ApiProperty({
		description: 'Id dos documentos',
		example: [1, 2],
		required: true,
	})
	@IsInt({
		each: true,
		message:
			'Os documentos informado não é válido. Por favor, forneça documentos válidos.',
	})
	@IsNotEmpty({
		message:
			'O campo de documentos é obrigatório. Por favor, forneça um documento.',
	})
	documentos_ids: number[];

	@ApiProperty({
		description: 'Status do tipo de documento',
		example: true,
		required: true,
	})
	@Validate(IsBooleanType, {
		message:
			'O campo Status informado não é válido. Por favor, forneça um valor válido.',
	})
	@Transform(BooleanTransformHelper)
	@IsOptional()
	recebido: boolean;
}
