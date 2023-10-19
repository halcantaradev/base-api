import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';
import { VirtualPackageType } from 'src/shared/consts/report-virtual-package-tyoe.const';
import { FiltersSearchVirtualPackageDto } from './filters-search-virtual-package.dto';

export class FiltersVirtualPackageDto extends FiltersSearchVirtualPackageDto {
	@ApiProperty({
		description: 'Tipo de relatório',
		enum: VirtualPackageType,
		example: Object.values(VirtualPackageType),
		required: false,
	})
	@IsNotEmpty({
		each: true,
		message:
			'O campo tipo de relatório informado não é válido. Por favor, forneça um tipo válido.',
	})
	@IsInt({
		message:
			'O campo tipo de relatório informado não é válido. Por favor, forneça um tipo válido.',
	})
	@Type(() => Number)
	tipo: number;
}
