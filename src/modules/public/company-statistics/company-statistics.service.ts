import { Injectable } from '@nestjs/common';
import { formatDateMonthOnly } from 'src/shared/helpers/date.helper';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';

@Injectable()
export class CompanyStatisticsService {
	constructor(private readonly prisma: PrismaService) {}

	async getDataCondominio() {
		const condominios = await this.prisma.pessoa.findMany({
			select: {
				updated_at_origin: true,
			},
			where: {
				updated_at_origin: { gte: new Date('2023-09-01') },
				tipos: { some: { tipo: { nome: 'condominio' } } },
			},
		});

		const group = condominios.reduce((accumulator, c) => {
			if (!accumulator[formatDateMonthOnly(c.updated_at_origin)]) {
				accumulator[formatDateMonthOnly(c.updated_at_origin)] = 1;
			} else {
				accumulator[formatDateMonthOnly(c.updated_at_origin)] += 1;
			}

			return accumulator;
		}, {});

		return group;
	}
}
