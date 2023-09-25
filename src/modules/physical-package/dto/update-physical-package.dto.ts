import { PartialType } from '@nestjs/swagger';
import { CreatePhysicalPackageDto } from './create-physical-package.dto';

export class UpdatePhysicalPackageDto extends PartialType(CreatePhysicalPackageDto) {}
