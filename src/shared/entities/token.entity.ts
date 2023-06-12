import { ApiProperty } from '@nestjs/swagger';

export class TokenEntity {
  @ApiProperty({
    description: 'Id do usuário',
    example: 1,
    readOnly: true,
  })
  id: number;

  @ApiProperty({
    description: 'Nome do usuário',
    example: 'Irineu Campos',
    readOnly: true,
  })
  nome: string;

  @ApiProperty({
    description: 'Id da empresa do usuário',
    example: 'usuario.exemplo',
    readOnly: true,
  })
  empresa_id: number;
}
