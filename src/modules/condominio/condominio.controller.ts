import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CondominioService } from './condominio.service';
import { FiltersDto } from './dto/filters.dto';

@Controller('condominios')
export class CondominioController {
	constructor(private readonly condominioService: CondominioService) {}

	@Post()
	async findAll(@Body() filters: FiltersDto) {
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

	@Get(':idCondominio/unidades')
	async findAllUnidades(@Param('idCondominio') idCondominio: string) {
		return {
			success: true,
			data: await this.condominioService.findAllUnidades(+idCondominio),
		};
	}

	@Get(':idCondominio/unidades/:id')
	async findOneUnidade(
		@Param('idCondominio') idCondominio: string,
		@Param('id') id: string,
	) {
		return {
			success: true,
			data: await this.condominioService.findOneUnidade(
				+idCondominio,
				+id,
			),
		};
	}
}
