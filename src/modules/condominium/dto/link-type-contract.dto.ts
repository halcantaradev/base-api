import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, Validate } from 'class-validator';
import { TypeContractExists } from '../validators';

export class LinkTypeContractDto {
	@ApiProperty({
		description: 'Contrato que será vinculado',
		example: [1, 2],
		required: true,
	})
	@IsNotEmpty({
		message:
			'O campo contrato é obrigatório. Por favor, forneça um contrato.',
	})
	@IsInt({
		each: true,
		message:
			'O campo contrato informado não é válido. Por favor, forneça um contrato válido.',
	})
	@Type(() => Number)
	@Validate(TypeContractExists, { each: true })
	tipos_contratos_ids: number[];
}
