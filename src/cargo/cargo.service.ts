import { Injectable } from '@nestjs/common';
import { CreateCargoDto } from './dto/create-cargo.dto';
import { UpdateCargoDto } from './dto/update-cargo.dto';
import { CargoRepository } from './cargo.repository';

@Injectable()
export class CargoService {
  constructor(private readonly repository: CargoRepository) {}

  create(createCargoDto: CreateCargoDto) {
    return 'This action adds a new cargo';
  }

  findAll() {
    return `This action returns all cargo`;
  }

  findOneById(id: number) {
    return this.repository.findOne({ id });
  }

  update(id: number, updateCargoDto: UpdateCargoDto) {
    return `This action updates a #${id} cargo`;
  }

  remove(id: number) {
    return `This action removes a #${id} cargo`;
  }
}
