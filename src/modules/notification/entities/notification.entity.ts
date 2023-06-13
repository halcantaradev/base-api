import { ApiProperty } from '@nestjs/swagger';

export class NotificationEntity {
  @ApiProperty({
    description: 'Informações da unidade',
    example: { codigo: '001' },
    required: true,
  })
  unidade: { codigo: string };

  @ApiProperty({
    description: 'Tipo da infração',
    example: { descricao: 'Animais' },
    required: true,
  })
  tipoInfracao: { descricao: string };

  @ApiProperty({
    description: 'Data da emissão',
    example: '2023-01-01T23:59:59.000Z',
    required: true,
  })
  data_emissao: Date;

  @ApiProperty({
    description: 'Data da infração',
    example: '2023-01-01T23:59:59.000Z',
    required: true,
  })
  data_infracao: Date;

  @ApiProperty({
    description: 'Número da notificação',
    example: '01/2023',
    required: true,
  })
  n_notificacao: string;

  @ApiProperty({
    description: 'Detalhamento da notificação',
    example: 'INFRAÇÃO DE TESTE',
    required: true,
  })
  detalhes_infracao: string;

  @ApiProperty({
    description: 'Tipo de registro da notificação',
    example: 1,
    required: true,
  })
  tipo_registro: 1 | 2;

  @ApiProperty({
    description: 'Fundamentação legal infrigida na notificação',
    example: 'LEI DE TESTE DO ARTIGO TESTE N° TESTE',
    required: true,
  })
  fundamentacao_legal: string;

  @ApiProperty({
    description: 'Observação da notificação',
    example: 'Observação Teste',
    required: false,
  })
  observacao: string;
}
