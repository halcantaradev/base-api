import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  Validate,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { IsBooleanType } from 'src/shared/validators/is_boolean_type.validator';
import { CargoExists } from '../validators';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    description: 'Email de acesso do usuário',
    example: 'usuario@exemplo.com',
    required: true,
  })
  @IsNotEmpty({
    message: 'O parâmetro email é obrigatório',
  })
  @IsEmail(
    { ignore_max_length: true },
    {
      message: 'O parâmetro email precisa ser um email válido',
    },
  )
  email: string;

  @ApiProperty({
    description: 'Nome do usuário',
    example: 'Usuario Teste',
    required: true,
  })
  @IsNotEmpty({
    message: 'O parâmetro nome é obrigatório',
  })
  @IsString({
    message: 'O parâmetro nome precisa ser do tipo String',
  })
  nome: string;

  @ApiProperty({
    description: 'Username de acesso do usuário',
    example: 'usuario.exemplo',
    required: true,
  })
  @IsNotEmpty({
    message: 'O parâmetro username é obrigatório',
  })
  @IsString({
    message: 'O parâmetro username precisa ser do tipo String',
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

  @ApiProperty({
    description: 'Cargo do usuário',
    example: 1,
    required: true,
  })
  @IsNotEmpty({
    message: 'O parâmetro cargo_id é obrigatório',
  })
  @IsInt({
    message: 'O parâmetro cargo_id precisa ser do tipo Int',
  })
  @Type(() => Number)
  @Validate(CargoExists)
  cargo_id: number;

  @ApiProperty({
    description: 'Situação atual do usuário',
    example: true,
    required: true,
  })
  @IsNotEmpty({
    message: 'O parâmetro ativo é obrigatório',
  })
  @Validate(IsBooleanType)
  @Transform(({ value }) => {
    return ['true', '1'].includes(value);
  })
  ativo: boolean;
}
