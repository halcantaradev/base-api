import { Injectable } from '@nestjs/common';
import { CreateCargoDto } from './dto/create-cargo.dto';
import { UpdateCargoDto } from './dto/update-cargo.dto';
import { PrismaService } from 'src/shared/services/prisma.service';
import { FilterCargoDto } from './dto/filter-user.dto';

@Injectable()
export class CargoRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(createCargoDto: CreateCargoDto) {
    return 'This action adds a new cargo';
  }

  findAll() {
    return `This action returns all cargo`;
  }

  findOne({ id }: FilterCargoDto) {
    return this.prisma.cargo.findFirst({
      where: {
        id,
      },
    });
  }

  update(id: number, updateCargoDto: UpdateCargoDto) {
    return `This action updates a #${id} cargo`;
  }

  remove(id: number) {
    return `This action removes a #${id} cargo`;
  }
}
