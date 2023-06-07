import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import { NotFoundException } from 'src/shared/errors';

@Injectable()
export class UserService {
  constructor(private readonly repository: UserRepository) {}

  async create(createUserDto: CreateUserDto, empresa_id: number) {
    await this.repository.create(
      createUserDto,
      empresa_id,
      createUserDto.cargo_id,
    );

    return;
  }

  findAll(empresa_id: number) {
    return this.repository.findAll(empresa_id);
  }

  findAllEnabled(empresa_id: number) {
    return this.repository.findAll(empresa_id, true);
  }

  async findOneById(id: number) {
    const user = await this.repository.findOne({
      id,
      include_empresa_data: true,
    });

    if (user == null) throw new NotFoundException('Usuário não encontrado');

    return user;
  }

  async findOneByUsername(username: string, include_password: boolean) {
    const user = await this.repository.findOne({
      username,
      include_empresa_data: true,
      include_password,
    });

    if (user == null) throw new NotFoundException('Usuário não encontrado');

    return user;
  }

  async findOneByEmail(email: string, include_password: boolean) {
    return this.repository.findOne({
      email,
      include_empresa_data: true,
      include_password,
    });
  }

  async update(id: number, empresa_id: number, updateUserDto: UpdateUserDto) {
    return this.repository.update(id, empresa_id, updateUserDto);
  }
}
