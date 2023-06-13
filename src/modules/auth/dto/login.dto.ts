import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Username de acesso do usuário',
    example: 'usuario.exemplo',
    required: true,
  })
  @IsNotEmpty({
    message: 'O usuário de acesso é obrigatório',
  })
  @IsString({
    message: 'O usuário de acesso não é válido',
  })
  username: string;

  @ApiProperty({
    description: 'Senha de acesso do usuário',
    example: '123456',
    required: true,
  })
  @IsNotEmpty({
    message: 'O parâmetro password é obrigatório',
  })
  @IsString({
    message: 'O parâmetro password precisa ser do tipo String',
  })
  password: string;
}
