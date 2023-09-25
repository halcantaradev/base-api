import { Injectable } from '@nestjs/common';
import { CreatePhysicalPackageDto } from './dto/create-physical-package.dto';
import { UpdatePhysicalPackageDto } from './dto/update-physical-package.dto';

@Injectable()
export class PhysicalPackageService {
  create(createPhysicalPackageDto: CreatePhysicalPackageDto) {
    return 'This action adds a new physicalPackage';
  }

  findAll() {
    return `This action returns all physicalPackage`;
  }

  findOne(id: number) {
    return `This action returns a #${id} physicalPackage`;
  }

  update(id: number, updatePhysicalPackageDto: UpdatePhysicalPackageDto) {
    return `This action updates a #${id} physicalPackage`;
  }

  remove(id: number) {
    return `This action removes a #${id} physicalPackage`;
  }
}
