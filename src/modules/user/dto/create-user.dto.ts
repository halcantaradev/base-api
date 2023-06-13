import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  Validate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UsernameNotExists, EmailNotExists, CargoExists } from '../validators';

export class CreateUserDto {
  @ApiProperty({
    description: 'Email de acesso do usuário',
    example: 'usuario@exemplo.com',
    required: true,
  })
  @IsNotEmpty({
    message: 'O email é obrigatório',
  })
  @IsEmail(
    { ignore_max_length: true },
    {
      message: 'O email informado não é válido',
    },
  )
  @Validate(EmailNotExists)
  email: string;

  @ApiProperty({
    description: 'Nome do usuário',
    example: 'Irineu Campos',
    required: true,
  })
  @IsNotEmpty({
    message: 'O nome é obrigatório',
  })
  @IsString({
    message: 'O nome precisa ser um texto',
  })
  nome: string;

  @ApiProperty({
    description: 'Username de acesso do usuário',
    example: 'usuario.exemplo',
    required: true,
  })
  @IsNotEmpty({
    message: 'O usuário de acesso é obrigatório',
  })
  @IsString({
    message: 'O usuário de acesso precisa ser do tipo String',
  })
  @Validate(UsernameNotExists)
  username: string;

  @ApiProperty({
    description: 'Senha de acesso do usuário',
    example: '123456',
    required: true,
  })
  @IsNotEmpty({
    message: 'A senha é obrigatório',
  })
  @IsString({
    message: 'A senha precisa ser um texto',
  })
  @Type(() => String)
  password: string;

  @ApiProperty({
    description: 'Cargo do usuário',
    example: 1,
    required: true,
  })
  @IsNotEmpty({
    message: 'O cargo é obrigatório',
  })
  @IsInt({
    message: 'O cargo informado não é válido',
  })
  @Type(() => Number)
  @Validate(CargoExists)
  cargo_id: number;
}
