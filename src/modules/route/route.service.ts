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
		dias: {
			select: {
				dia: true,
			},
		},
		ativo: true,
	};

	private async validateRoute(turno: number, dias: number[], id?: number) {
		let rotas = await this.prisma.rota.findMany({
			select: this.select,
			where: {
				id: { not: id },
				turno: turno,
				dias: {
					some: {
						dia: {
							in: dias,
						},
					},
				},
				excluido: false,
			},
		});

		rotas = rotas.filter(
			(route) =>
				JSON.stringify(route.dias.map((dia) => dia.dia)) ==
				JSON.stringify(dias),
		);

		if (rotas.length) throw new BadRequestException('Rota já cadastrada');
	}

	async create(createRouteDto: CreateRouteDto, empresa_id: number) {
		await this.validateRoute(createRouteDto.turno, createRouteDto.dias);

		return this.prisma.rota.create({
			data: {
				turno: createRouteDto.turno,
				dias: {
					createMany: {
						data: createRouteDto.dias.map((dia) => ({
							dia: dia,
						})),
					},
				},
				empresa_id,
				ativo: createRouteDto.ativo,
			},
		});
	}

	async findAll(empresa_id: number) {
		const rotas = await this.prisma.rota.findMany({
			select: this.select,
			where: { empresa_id, excluido: false },
		});

		return rotas.map((route) => ({
			...route,
			dias: route.dias.map((dia) => dia.dia),
		}));
	}

	async findAllActive(empresa_id: number) {
		const rotas = await this.prisma.rota.findMany({
			select: this.select,
			where: { empresa_id, excluido: false },
		});

		return rotas.map((route) => ({
			...route,
			dias: route.dias.map((dia) => dia.dia),
		}));
	}

	async findOne(id: number, empresa_id: number) {
		if (Number.isNaN(id)) {
			throw new BadRequestException('Rota não encontrada');
		}

		const route = await this.prisma.rota.findFirst({
			select: this.select,
			where: { id, empresa_id, excluido: false },
		});

		return route
			? {
					...route,
					dias: route.dias.map((dia) => dia.dia),
			  }
			: null;
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
			updateRouteDto.dias || route.dias,
			id,
		);

		const updatedRoute = await this.prisma.rota.update({
			select: this.select,
			data: {
				turno: updateRouteDto.turno || undefined,
				dias: updateRouteDto.dias
					? {
							deleteMany: {
								rota_id: id,
							},
							createMany: {
								data: updateRouteDto.dias.map((dia) => ({
									dia: dia,
								})),
							},
					  }
					: undefined,
				ativo:
					updateRouteDto.ativo != null
						? updateRouteDto.ativo
						: undefined,
			},
			where: { id },
		});

		return {
			...updatedRoute,
			dias: updatedRoute.dias.map((dia) => dia.dia),
		};
	}

	async remove(id: number, empresa_id) {
		const route = await this.findOne(id, empresa_id);

		if (!route) throw new BadRequestException('Rota não encontrada');

		const updatedRoute = await this.prisma.rota.update({
			select: this.select,
			data: { excluido: true },
			where: { id },
		});

		return {
			...updatedRoute,
			dias: updatedRoute.dias.map((dia) => dia.dia),
		};
	}
}
