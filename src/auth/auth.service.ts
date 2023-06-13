import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PasswordHelper } from 'src/shared/helpers/password.helper';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async signIn(username, pass) {
    const user = await this.prisma.user.findFirst({
      include: { empresas_has_usuarios: true },
      where: { username },
    });

    if (!user) throw new NotFoundException('Usuário ou senha inválidos');

    if (user.ativo && !PasswordHelper.compare(pass, user?.password)) {
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
