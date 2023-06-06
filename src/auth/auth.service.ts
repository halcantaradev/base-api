import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { PasswordHelper } from 'src/shared/helpers/password.helper';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(username, pass) {
    const user = await this.usersService.findOneByUsername(username);

    if (!PasswordHelper.compare(pass, user?.password)) {
      throw new UnauthorizedException();
    }

    const payload = {
      id: user.id,
      nome: user.nome,
      empresa_id: user.empresas_has_usuarios[0].empresa_id,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
