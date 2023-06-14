import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateNotificationDto } from './create-notification.dto';
import { IsOptional, Validate } from 'class-validator';
import { Transform } from 'class-transformer';
import { IsBooleanType } from 'src/shared/validators/is_boolean_type.validator';

export class UpdateNotificationDto extends PartialType(CreateNotificationDto) {
  @IsOptional()
  unidade_id: number;

  @IsOptional()
  infracao_id: number;

  @IsOptional()
  data_emissao: Date;

  @IsOptional()
  data_infração: Date;

  @IsOptional()
  n_notificacao: string;

  @IsOptional()
  detalhes_infracao: string;

  @IsOptional()
  tipo_registro: 1 | 2;

  @IsOptional()
  fundamentacao_legal: string;

  @IsOptional()
  observacao: string;

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
  @Transform(({ value }) => {
    return ['true', '1'].includes(value);
  })
  ativo: boolean;
}