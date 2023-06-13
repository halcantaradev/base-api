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
    message: 'O parâmetro unidade_id é obrigatório',
  })
  @IsInt({
    message: 'O parâmetro unidade_id precisa ser do tipo Int',
  })
  unidade_id: number;

  @ApiProperty({
    description: 'Id do tipo da infração',
    example: 1,
    required: true,
  })
  @IsNotEmpty({
    message: 'O parâmetro infracao_id é obrigatório',
  })
  @IsInt({
    message: 'O parâmetro infracao_id precisa ser do tipo Int',
  })
  infracao_id: number;

  @ApiProperty({
    description: 'Data da emissão',
    example: '2023-01-01T23:59:59.000Z',
    required: true,
  })
  @IsNotEmpty({
    message: 'O parâmetro data_emissao é obrigatório',
  })
  @IsDate({
    message: 'O parâmetro data_emissao precisa ser do tipo Date',
  })
  @Type(() => Date)
  data_emissao: Date;

  @ApiProperty({
    description: 'Data da infração',
    example: '2023-01-01T23:59:59.000Z',
    required: true,
  })
  @IsNotEmpty({
    message: 'O parâmetro data_infracao é obrigatório',
  })
  @IsDate({
    message: 'O parâmetro data_infracao precisa ser do tipo Date',
  })
  @Type(() => Date)
  data_infracao: Date;

  @ApiProperty({
    description: 'Número da notificação',
    example: '01/2023',
    required: true,
  })
  @IsNotEmpty({
    message: 'O parâmetro n_notificacao é obrigatório',
  })
  @IsString({
    message: 'O parâmetro n_notificacao precisa ser do tipo String',
  })
  n_notificacao: string;

  @ApiProperty({
    description: 'Detalhamento da notificação',
    example: 'INFRAÇÃO DE TESTE',
    required: true,
  })
  @IsNotEmpty({
    message: 'O parâmetro detalhes_infracao é obrigatório',
  })
  @IsString({
    message: 'O parâmetro detalhes_infracao precisa ser do tipo String',
  })
  detalhes_infracao: string;

  @ApiProperty({
    description: 'Tipo de registro da notificação',
    example: 1,
    required: true,
  })
  @IsNotEmpty({
    message: 'O parâmetro tipo_registro é obrigatório',
  })
  @IsInt({
    message: 'O parâmetro tipo_registro precisa ser do tipo Int',
  })
  tipo_registro: 1 | 2;

  @ApiProperty({
    description: 'Fundamentação legal infrigida na notificação',
    example: 'LEI DE TESTE DO ARTIGO TESTE N° TESTE',
    required: true,
  })
  @IsNotEmpty({
    message: 'O parâmetro fundamentacao_legal é obrigatório',
  })
  @IsString({
    message: 'O parâmetro fundamentacao_legal precisa ser do tipo String',
  })
  fundamentacao_legal: string;

  @ApiProperty({
    description: 'Observação da notificação',
    example: 'Observação Teste',
    required: false,
  })
  @IsOptional()
  @IsString({
    message: 'O parâmetro observacao precisa ser do tipo String',
  })
  observacao: string;
}
