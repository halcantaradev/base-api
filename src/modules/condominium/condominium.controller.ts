import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CondominiumService } from './condominium.service';
import { FiltersCondominiumDto } from './dto/filters.dto';

@Controller('condominiums')
export class CondominiumController {
	constructor(private readonly condominioService: CondominiumService) {}

	@Post()
	async findAll(@Body() filters: FiltersCondominiumDto) {
		return {
			success: true,
			data: await this.condominioService.findAll(filters),
		};
	}

	@Get(':id')
	async findOne(@Param('id') id: string) {
		return {
			success: true,
			data: await this.condominioService.findOne(+id),
		};
	}

	@Get(':id_condominium/residences')
	async findAllResidences(@Param('id_condominium') id_condominium: string) {
		return {
			success: true,
			data: await this.condominioService.findAllResidences(
				+id_condominium,
			),
		};
	}

	@Get(':id_condominium/residences/:id')
	async findOneResidence(
		@Param('id_condominium') id_condominium: string,
		@Param('id') id: string,
	) {
		return {
			success: true,
			data: await this.condominioService.findOneResidence(
				+id_condominium,
				+id,
			),
		};
	}
}
