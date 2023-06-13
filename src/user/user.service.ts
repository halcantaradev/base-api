import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotFoundException } from 'src/shared/errors';
import { PasswordHelper } from 'src/shared/helpers/password.helper';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto, empresa_id: number) {
    await this.prisma.user.create({
      data: {
        nome: createUserDto.nome,
        username: createUserDto.username,
        password: PasswordHelper.create(createUserDto.password),
        email: createUserDto.email,
        empresas_has_usuarios: {
          create: {
            cargo_id: createUserDto.cargo_id,
            empresa_id,
          },
        },
      },
    });

    return;
  }

  async findAll(empresa_id: number) {
    return this.prisma.user.findMany({
      select: {
        id: true,
        nome: true,
        username: true,
        email: true,
        ativo: true,
        updateda_at: true,
        empresas_has_usuarios: {
          select: {
            empresa_id: true,
            cargo: {
              select: {
                nome: true,
              },
            },
          },
        },
      },
      where: {
        empresas_has_usuarios: {
          every: {
            empresa_id: empresa_id,
          },
        },
      },
      orderBy: {
        nome: 'asc',
      },
    });
  }

  findAllEnabled(empresa_id: number) {
    return this.prisma.user.findMany({
      select: {
        id: true,
        nome: true,
        username: true,
        email: true,
        ativo: true,
        updateda_at: true,
        empresas_has_usuarios: {
          select: {
            empresa_id: true,
            cargo: {
              select: {
                nome: true,
              },
            },
          },
        },
      },
      where: {
        ativo: true,
        empresas_has_usuarios: {
          every: {
            empresa_id: empresa_id,
          },
        },
      },
      orderBy: {
        nome: 'asc',
      },
    });
  }

  async findOneById(id: number) {
    const user = this.prisma.user.findFirst({
      select: {
        id: true,
        nome: true,
        username: true,
        email: true,
        ativo: true,
        updateda_at: true,
        empresas_has_usuarios: {
          select: {
            empresa_id: true,
            cargo: {
              select: {
                nome: true,
              },
            },
          },
        },
      },
      where: {
        id,
      },
    });

    if (user == null) throw new NotFoundException('Usuário ou senha inválidos');

    return user;
  }

  async findOneByUsername(username: string, include_password: boolean) {
    const user = await this.prisma.user.findFirst({
      select: {
        id: true,
        nome: true,
        username: true,
        password: include_password || false,
        email: true,
        ativo: true,
        updateda_at: true,
        empresas_has_usuarios: {
          select: {
            empresa_id: true,
            cargo: {
              select: {
                nome: true,
              },
            },
          },
        },
      },
      where: {
        username,
      },
    });

    if (user == null) throw new NotFoundException('Usuário ou senha inválidos');

    return user;
  }

  async findOneByEmail(email: string, include_password: boolean) {
    const user = this.prisma.user.findFirst({
      select: {
        id: true,
        nome: true,
        username: true,
        password: include_password || false,
        email: true,
        ativo: true,
        updateda_at: true,
        empresas_has_usuarios: {
          select: {
            empresa_id: true,
            cargo: {
              select: {
                nome: true,
              },
            },
          },
        },
      },
      where: {
        email,
      },
    });

    if (user == null) throw new NotFoundException('Usuário ou senha inválidos');

    return user;
  }

  async update(id: number, empresa_id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      select: {
        id: true,
        nome: true,
        username: true,
        email: true,
        ativo: true,
        updateda_at: true,
        empresas_has_usuarios: {
          select: {
            empresa_id: true,
            cargo: {
              select: {
                nome: true,
              },
            },
          },
        },
      },
      data: {
        nome: updateUserDto.nome,
        password: updateUserDto.password
          ? PasswordHelper.create(updateUserDto.password)
          : undefined,
        email: updateUserDto.email,
        ativo: updateUserDto.ativo,
        empresas_has_usuarios: {
          updateMany: {
            data: {
              cargo_id: updateUserDto.cargo_id,
            },
            where: {
              empresa_id,
              usuario_id: id,
            },
          },
        },
      },
      where: {
        id,
      },
    });
  }
}
