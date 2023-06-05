import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({
    message: 'O parâmetro username é obrigatório',
  })
  @IsString({
    message: 'O parâmetro username precisa ser do tipo String',
  })
  username: string;

  @IsNotEmpty({
    message: 'O parâmetro password é obrigatório',
  })
  @IsString({
    message: 'O parâmetro password precisa ser do tipo String',
  })
  password: string;
}
