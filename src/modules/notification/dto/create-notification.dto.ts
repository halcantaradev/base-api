import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({
    description: 'Id da unidade',
    example: 1,
    required: true,
  })
  @IsNotEmpty({
    message: 'A unidade é obrigatória',
  })
  @IsInt({
    message: 'A unidade informada não é válido',
  })
  unidade_id: number;

  @ApiProperty({
    description: 'Id do tipo da infração',
    example: 1,
    required: true,
  })
  @IsNotEmpty({
    message: 'A infração é obrigatório',
  })
  @IsInt({
    message: 'A infração informada não é válida',
  })
  infracao_id: number;

  @ApiProperty({
    description: 'Data da emissão',
    example: '2023-01-01T23:59:59.000Z',
    required: true,
  })
  @IsNotEmpty({
    message: 'A data de emissão é obrigatória',
  })
  @IsDate({
    message: 'A data de emissão informada não é válida',
  })
  @Type(() => Date)
  data_emissao: Date;

  @ApiProperty({
    description: 'Data da infração',
    example: '2023-01-01T23:59:59.000Z',
    required: true,
  })
  @IsNotEmpty({
    message: 'A data de infração é obrigatório',
  })
  @IsDate({
    message: 'A data de infração informada não é válida',
  })
  @Type(() => Date)
  data_infracao: Date;

  @ApiProperty({
    description: 'Número da notificação',
    example: '01/2023',
    required: true,
  })
  @IsNotEmpty({
    message: 'O número da notificação é obrigatório',
  })
  @IsString({
    message: 'O número da notificação informado não é válido',
  })
  n_notificacao: string;

  @ApiProperty({
    description: 'Detalhamento da notificação',
    example: 'INFRAÇÃO DE TESTE',
    required: true,
  })
  @IsNotEmpty({
    message: 'O detalhe da notificação é obrigatório',
  })
  @IsString({
    message: 'O detalhe da notificação informado não é válido',
  })
  detalhes_infracao: string;

  @ApiProperty({
    description: 'Tipo de registro da notificação',
    example: 1,
    required: true,
  })
  @IsNotEmpty({
    message: 'O tipo de registro é obrigatório',
  })
  @IsInt({
    message: 'O tipo de registro informado não é válido',
  })
  tipo_registro: 1 | 2;

  @ApiProperty({
    description: 'Fundamentação legal infrigida na notificação',
    example: 'LEI DE TESTE DO ARTIGO TESTE N° TESTE',
    required: true,
  })
  @IsNotEmpty({
    message: 'A fundamentação legal é obrigatória',
  })
  @IsString({
    message: 'A fundamentação legal informada não é válida',
  })
  fundamentacao_legal: string;

  @ApiProperty({
    description: 'Observação da notificação',
    example: 'Observação Teste',
    required: false,
  })
  @IsOptional()
  @IsString({
    message: 'A observação informada não é válida',
  })
  observacao: string;
}
