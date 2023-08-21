import { ApiProperty } from '@nestjs/swagger';
import { CreateNotificationDto } from './create-notification.dto';
import { IsOptional, Validate } from 'class-validator';
import { Transform } from 'class-transformer';
import { IsBooleanType } from 'src/shared/validators/is_boolean_type.validator';
import { BooleanTransformHelper } from 'src/shared/helpers/boolean.helper';

export class UpdateNotificationDto extends CreateNotificationDto {
	@IsOptional()
	unidade_id: number;

	@IsOptional()
	pessoa_id: number;

	@IsOptional()
	tipo_infracao_id: number;

	@IsOptional()
	data_emissao: Date;

	@IsOptional()
	data_infracao: Date;

	@IsOptional()
	detalhes_infracao: string;

	@IsOptional()
	tipo_registro: 1 | 2;

	@IsOptional()
	fundamentacao_legal: string;

	@IsOptional()
	observacoes: string;

	@ApiProperty({
		description: 'Situação atual da notificação',
		example: true,
		required: false,
	})
	@IsOptional()
	@Validate(IsBooleanType, {
		message:
			'O campo status informado não é válido. Por favor, forneça um status válido.',
	})
	@Transform(BooleanTransformHelper)
	ativo: boolean;

	@IsOptional()
	arquivos_ids: number[];

	@IsOptional()
	layout_id: number;

	@IsOptional()
	doc_gerado?: string;
}
