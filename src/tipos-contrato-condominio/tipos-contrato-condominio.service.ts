import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTiposContratoCondominioDto } from './dto/create-tipos-contrato-condominio.dto';
import { UpdateTiposContratoCondominioDto } from './dto/update-tipos-contrato-condominio.dto';
import { PrismaService } from 'src/shared/services/prisma.service';
import { Pagination } from 'src/shared/entities/pagination.entity';

@Injectable()
export class TiposContratoCondominioService {
	constructor(private readonly prismaServices: PrismaService) {}

	async create(
		createTiposContratoCondominioDto: CreateTiposContratoCondominioDto,
	) {
		return this.prismaServices.tipoContratoCondominio.create({
			data: createTiposContratoCondominioDto,
		});
	}

	async findAll(pagination?: Pagination) {
		const tiposContrato =
			await this.prismaServices.tipoContratoCondominio.findMany({
				take: 20,
				skip: pagination?.page
					? (pagination?.page - 1) * 20
					: undefined,
			});

		const total_pages =
			await this.prismaServices.tipoContratoCondominio.count();

		return { data: tiposContrato, total_pages };
	}

	findOne(id: number) {
		return this.prismaServices.tipoContratoCondominio.findFirst({
			where: {
				id,
			},
		});
	}

	async update(
		id: number,
		updateTiposContratoCondominioDto: UpdateTiposContratoCondominioDto,
	) {
		const tipoControato =
			await this.prismaServices.tipoContratoCondominio.findFirst({
				where: {
					id,
				},
			});

		if (!tipoControato)
			throw new BadRequestException('Tipo de contrato não encontrado');

		return this.prismaServices.tipoContratoCondominio.update({
			data: updateTiposContratoCondominioDto,
			where: {
				id,
			},
		});
	}
}
