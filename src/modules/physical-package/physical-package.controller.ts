import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PhysicalPackageService } from './physical-package.service';
import { CreatePhysicalPackageDto } from './dto/create-physical-package.dto';
import { UpdatePhysicalPackageDto } from './dto/update-physical-package.dto';

@Controller('physical-package')
export class PhysicalPackageController {
  constructor(private readonly physicalPackageService: PhysicalPackageService) {}

  @Post()
  create(@Body() createPhysicalPackageDto: CreatePhysicalPackageDto) {
    return this.physicalPackageService.create(createPhysicalPackageDto);
  }

  @Get()
  findAll() {
    return this.physicalPackageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.physicalPackageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePhysicalPackageDto: UpdatePhysicalPackageDto) {
    return this.physicalPackageService.update(+id, updatePhysicalPackageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.physicalPackageService.remove(+id);
  }
}
