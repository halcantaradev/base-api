import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import { InternalErrorException, NotFoundException } from 'src/shared/errors';

@Injectable()
export class UserService {
  constructor(private readonly repository: UserRepository) {}

  async create(createUserDto: CreateUserDto, empresa_id: number) {
    try {
      await this.repository.create(
        createUserDto,
        empresa_id,
        createUserDto.cargo_id,
      );

      return;
    } catch (err) {
      throw new InternalErrorException(err);
    }
  }

  findAll(empresa_id: number) {
    try {
      return this.repository.findAll(empresa_id);
    } catch (err) {
      throw new InternalErrorException(err);
    }
  }

  findAllEnabled(empresa_id: number) {
    try {
      return this.repository.findAll(empresa_id, true);
    } catch (err) {
      throw new InternalErrorException(err);
    }
  }

  async findOneById(id: number) {
    try {
      const user = await this.repository.findOne({
        id,
        include_empresa_data: true,
      });

      if (user == null) throw new NotFoundException('Usuário não encontrado');

      return user;
    } catch (err) {
      throw new InternalErrorException(err);
    }
  }

  async findOneByUsername(username: string, include_password: boolean) {
    try {
      const user = await this.repository.findOne({
        username,
        include_empresa_data: true,
        include_password,
      });

      if (user == null) throw new NotFoundException('Usuário não encontrado');

      return user;
    } catch (err) {
      throw new InternalErrorException(err);
    }
  }

  async findOneByEmail(email: string, include_password: boolean) {
    try {
      return this.repository.findOne({
        email,
        include_empresa_data: true,
        include_password,
      });
    } catch (err) {
      throw new InternalErrorException(err);
    }
  }

  async update(id: number, empresa_id: number, updateUserDto: UpdateUserDto) {
    try {
      return this.repository.update(id, empresa_id, updateUserDto);
    } catch (err) {
      throw new InternalErrorException(err);
    }
  }
}
