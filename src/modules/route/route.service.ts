import { Prisma } from '@prisma/client';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class RouteService {
	constructor(private readonly prisma: PrismaService) {}

	select: Prisma.RotaSelect = {
		id: true,
		turno: true,
		dom: true,
		seg: true,
		ter: true,
		qua: true,
		qui: true,
		sex: true,
		sab: true,
		ativo: true,
	};

	private async validateRoute(
		turno: number,
		dias: {
			dom?: boolean;
			seg?: boolean;
			ter?: boolean;
			qua?: boolean;
			qui?: boolean;
			sex?: boolean;
			sab?: boolean;
		},
		id?: number,
	) {
		const rotas = await this.prisma.rota.findMany({
			select: this.select,
			where: {
				id: { not: id },
				turno: turno,
				dom: dias.dom,
				seg: dias.seg,
				ter: dias.ter,
				qua: dias.qua,
				qui: dias.qui,
				sex: dias.sex,
				sab: dias.sab,
				excluido: false,
			},
		});

		if (rotas.length) throw new BadRequestException('Rota já cadastrada');
	}

	async create(createRouteDto: CreateRouteDto, empresa_id: number) {
		await this.validateRoute(createRouteDto.turno, {
			dom: createRouteDto.dom,
			seg: createRouteDto.seg,
			ter: createRouteDto.ter,
			qua: createRouteDto.qua,
			qui: createRouteDto.qui,
			sex: createRouteDto.sex,
			sab: createRouteDto.sab,
		});

		return this.prisma.rota.create({
			data: {
				turno: createRouteDto.turno,
				dom:
					createRouteDto.dom != null ? createRouteDto.dom : undefined,
				seg:
					createRouteDto.seg != null ? createRouteDto.seg : undefined,
				ter:
					createRouteDto.ter != null ? createRouteDto.ter : undefined,
				qua:
					createRouteDto.qua != null ? createRouteDto.qua : undefined,
				qui:
					createRouteDto.qui != null ? createRouteDto.qui : undefined,
				sex:
					createRouteDto.sex != null ? createRouteDto.sex : undefined,
				sab:
					createRouteDto.sab != null ? createRouteDto.sab : undefined,
				empresa_id,
				ativo: createRouteDto.ativo,
			},
		});
	}

	findAll(empresa_id: number) {
		return this.prisma.rota.findMany({
			select: this.select,
			where: { empresa_id, excluido: false },
			orderBy: { id: 'asc' },
		});
	}

	findAllActive(empresa_id: number) {
		return this.prisma.rota.findMany({
			select: this.select,
			where: { empresa_id, excluido: false, ativo: true },
			orderBy: { id: 'asc' },
		});
	}

	findOne(id: number, empresa_id: number) {
		if (Number.isNaN(id)) {
			throw new BadRequestException('Rota não encontrada');
		}

		return this.prisma.rota.findFirst({
			select: this.select,
			where: { id, empresa_id, excluido: false },
		});
	}

	async update(
		id: number,
		updateRouteDto: UpdateRouteDto,
		empresa_id: number,
	) {
		const route = await this.findOne(id, empresa_id);

		if (!route) throw new BadRequestException('Rota não encontrada');

		await this.validateRoute(
			updateRouteDto.turno || route.turno,
			{
				dom: updateRouteDto.dom,
				seg: updateRouteDto.seg,
				ter: updateRouteDto.ter,
				qua: updateRouteDto.qua,
				qui: updateRouteDto.qui,
				sex: updateRouteDto.sex,
				sab: updateRouteDto.sab,
			},
			id,
		);

		return this.prisma.rota.update({
			select: this.select,
			data: {
				turno: updateRouteDto.turno || undefined,
				dom:
					updateRouteDto.dom != null ? updateRouteDto.dom : undefined,
				seg:
					updateRouteDto.seg != null ? updateRouteDto.seg : undefined,
				ter:
					updateRouteDto.ter != null ? updateRouteDto.ter : undefined,
				qua:
					updateRouteDto.qua != null ? updateRouteDto.qua : undefined,
				qui:
					updateRouteDto.qui != null ? updateRouteDto.qui : undefined,
				sex:
					updateRouteDto.sex != null ? updateRouteDto.sex : undefined,
				sab:
					updateRouteDto.sab != null ? updateRouteDto.sab : undefined,
				ativo:
					updateRouteDto.ativo != null
						? updateRouteDto.ativo
						: undefined,
			},
			where: { id },
		});
	}

	async remove(id: number, empresa_id) {
		const route = await this.findOne(id, empresa_id);

		if (!route) throw new BadRequestException('Rota não encontrada');

		return this.prisma.rota.update({
			select: this.select,
			data: { excluido: true },
			where: { id },
		});
	}
}
