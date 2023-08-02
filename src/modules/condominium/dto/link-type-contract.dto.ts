import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, Validate } from 'class-validator';
import { TypeContractExists } from '../validators';

export class LinkTypeContractDto {
	@ApiProperty({
		description: 'Contrato que será vinculado',
		example: 1,
		required: true,
	})
	@IsNotEmpty({
		message:
			'O campo contrato é obrigatório. Por favor, forneça um contrato.',
	})
	@IsInt({
		message:
			'O campo contrato informado não é válido. Por favor, forneça um contrato válido.',
	})
	@Type(() => Number)
	@Validate(TypeContractExists)
	tipo_contrato_id: number;
}
