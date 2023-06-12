import { ApiProperty } from '@nestjs/swagger';
import { CargoEntity } from './cargo.entity';

export class EmpresaHasUsuarioEntity {
  @ApiProperty({
    description: 'Id da empresa do usuário',
    example: 1,
    required: false,
  })
  empresa_id: number;

  @ApiProperty({
    description: 'Dados do cargo do usuario na empresa',
    type: CargoEntity,
    required: false,
  })
  cargo: CargoEntity;
}
