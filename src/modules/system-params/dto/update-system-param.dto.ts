import { PartialType } from '@nestjs/swagger';
import { CreateSystemParamDto } from './create-system-param.dto';

export class UpdateSystemParamDto extends PartialType(CreateSystemParamDto) {}
