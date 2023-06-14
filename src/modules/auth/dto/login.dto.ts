import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Username de acesso do usuário',
    example: 'admin',
    required: true,
  })
  @IsNotEmpty({
    message: 'O campo usuário é obrigatório. Por favor, forneça um usuário.',
  })
  @IsString({
    message:
      'O campo usuário informado não é válido. Por favor, forneça um usuário válido.',
  })
  username: string;

  @ApiProperty({
    description: 'Senha de acesso do usuário',
    example: '123456',
    required: true,
  })
  @IsNotEmpty({
    message: 'O campo senha é obrigatório. Por favor, forneça uma senha.',
  })
  @IsString({
    message:
      'O campo senha informado não é válido. Por favor, forneça um senha válido.',
  })
  password: string;
}
