import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/shared/services/prisma.service';
import { FilterUserDto } from './dto/filter-user.dto';
import { PasswordHelper } from 'src/shared/helpers/password.helper';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createUserDto: CreateUserDto,
    empresa_id: number,
    cargo_id: number,
  ) {
    return this.prisma.user.create({
      data: {
        nome: createUserDto.nome,
        username: createUserDto.username,
        password: PasswordHelper.create(createUserDto.password),
        email: createUserDto.email,
        empresas_has_usuarios: {
          create: {
            cargo_id,
            empresa_id,
          },
        },
      },
    });
  }

  async findAll(empresa_id: number, ativo?: boolean) {
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
        ativo: ativo,
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

  async findOne({
    id,
    username,
    email,
    include_password,
    include_empresa_data,
  }: FilterUserDto) {
    return this.prisma.user.findFirst({
      select: {
        id: true,
        nome: true,
        username: true,
        password: include_password || false,
        email: true,
        ativo: true,
        updateda_at: true,
        empresas_has_usuarios: include_empresa_data
          ? {
              select: {
                empresa_id: true,
                cargo: {
                  select: {
                    nome: true,
                  },
                },
              },
            }
          : false,
      },
      where: {
        id,
        email,
        username,
      },
    });
  }

  async update(
    usuario_id: number,
    empresa_id: number,
    updateUserDto: UpdateUserDto,
  ) {
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
              empresa_id: empresa_id,
              usuario_id: usuario_id,
            },
          },
        },
      },
      where: {
        id: usuario_id,
      },
    });
  }
}
