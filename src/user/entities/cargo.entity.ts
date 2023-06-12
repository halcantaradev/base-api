import { ApiProperty } from '@nestjs/swagger';

export class CargoEntity {
  @ApiProperty({
    description: 'Nome do cargo do usuário na empresa',
    example: 'Cargo Teste',
    required: false,
  })
  nome: string;
}
