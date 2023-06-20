import { PartialType } from '@nestjs/swagger';
import { CreateOcupationDto } from './create-ocupation.dto';

export class UpdateOcupationDto extends PartialType(CreateOcupationDto) {}
