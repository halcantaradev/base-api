import { Transform } from 'class-transformer';
import { IsBooleanType } from 'src/shared/validators';
import { IsOptional, Validate } from 'class-validator';
import { CreateProtocolDto } from './create-protocol.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { BooleanTransformHelper } from 'src/shared/helpers/boolean.helper';

export class UpdateProtocolDto extends PartialType(CreateProtocolDto) {
	@IsOptional()
	tipo?: 1 | 2;

	@IsOptional()
	destino_departamento_id?: number;

	@IsOptional()
	destino_usuario_id?: number;

	@IsOptional()
	origem_departamento_id?: number;

	@IsOptional()
	retorna_malote_vazio?: boolean;

	@ApiProperty({
		description: 'Status do protocolo',
		example: true,
		required: false,
	})
	@Validate(IsBooleanType, {
		message:
			'O campo status informado não é válido. Por favor, forneça um status válido.',
	})
	@Transform(BooleanTransformHelper)
	@IsOptional()
	ativo?: boolean;

	@ApiProperty({
		description: 'Status de finalização do protocolo',
		example: true,
		required: false,
	})
	@Validate(IsBooleanType, {
		message:
			'O campo progresso informado não é válido. Por favor, forneça um válido.',
	})
	@Transform(BooleanTransformHelper)
	@IsOptional()
	finalizado?: boolean;
}
