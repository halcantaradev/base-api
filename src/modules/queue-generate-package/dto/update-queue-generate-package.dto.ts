import { PartialType } from '@nestjs/swagger';
import { CreateQueueGeneratePackageDto } from './create-queue-generate-package.dto';

export class UpdateQueueGeneratePackageDto extends PartialType(
	CreateQueueGeneratePackageDto,
) {}
