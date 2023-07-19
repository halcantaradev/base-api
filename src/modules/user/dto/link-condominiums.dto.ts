import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, Validate } from 'class-validator';
import { BooleanTransformHelper } from 'src/shared/helpers/boolean.helper';
import { IsBooleanType } from 'src/shared/validators/is_boolean_type.validator';

export class LinkCondominiumsDto {
	@ApiProperty({
		description: 'Departamentos do usuário',
		example: 1,
		required: true,
	})
	@IsInt({
		message:
			'O campo departamentos informado não é válido. Por favor, forneça um departamento válido.',
		each: true,
	})
	@IsNotEmpty({
		message:
			'O campo departamentos é obrigatório. Por favor, forneça um departamento.',
	})
	departamento_id: number;

	@ApiProperty({
		description: 'Status de acesso a todos os condominios do departamento',
		example: true,
		required: true,
	})
	@Validate(IsBooleanType, {
		message:
			'O campo acessar todos os condominíos informado não é válido. Por favor, forneça um valor válido.',
	})
	@Transform(BooleanTransformHelper)
	@IsNotEmpty({
		message:
			'O campo de acessar todos os condominíos é obrigatório. Por favor, forneça um valor.',
	})
	acessa_todos_condominios: boolean;

	@ApiProperty({
		description: 'Condomínios do usuário',
		example: [1, 2],
		required: true,
	})
	@IsInt({
		message:
			'O campo de condomínios informado não é válido. Por favor, forneça um condomínio válido.',
		each: true,
	})
	@IsNotEmpty({
		message:
			'O campo de condomínios é obrigatório. Por favor, forneça um condomínio.',
	})
	condominios_ids: number[];
}
