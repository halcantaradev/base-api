import { PartialType } from '@nestjs/swagger';
import { CreateVirtualPackageDto } from './create-virtual-package.dto';

export class UpdateVirtualPackageDto extends PartialType(
	CreateVirtualPackageDto,
) {}
