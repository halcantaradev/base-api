import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/shared/services/prisma.service';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(readonly prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOneById(id: number): Promise<UserEntity | null> {
    return this.prisma.user.findFirst({
      where: {
        id: id,
      },
    });
  }

  async findOneByUsername(username: string): Promise<UserEntity | null> {
    return this.prisma.user.findFirst({
      where: {
        username: username,
      },
      include: {
        empresas_has_usuarios: true,
      },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
