import { Injectable } from '@nestjs/common';
import { formatDateMonthOnlyNumber } from 'src/shared/helpers/date.helper';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';

@Injectable()
export class CompanyStatisticsService {
	constructor(private readonly prisma: PrismaService) {}

	async getDataCondominio(empresa_id: number) {
		const ativos = await this.prisma.pessoa.count({
			where: {
				ativo: true,
				tipos: { some: { tipo: { nome: 'condominio' } } },
				empresa_id,
			},
		});

		const inativos = await this.prisma.pessoa.count({
			where: {
				ativo: false,
				tipos: { some: { tipo: { nome: 'condominio' } } },
				empresa_id,
			},
		});

		return {
			ativos,
			inativos,
		};
	}

	async getNotificacoes(empresa_id: number) {
		const dataFiltro = new Date();
		dataFiltro.setMonth(dataFiltro.getMonth() - 3);

		const notificacoes = await this.prisma.notificacao.findMany({
			select: { data_emissao: true },
			where: {
				ativo: true,
				tipo_registro: 1,
				data_emissao: { gte: dataFiltro },
				pessoa: { empresa_id },
			},
			orderBy: { data_emissao: 'asc' },
		});
		const notData = {};
		notificacoes.forEach((notify) => {
			if (!notData[formatDateMonthOnlyNumber(notify.data_emissao)]) {
				notData[formatDateMonthOnlyNumber(notify.data_emissao)] = 1;
			} else {
				notData[formatDateMonthOnlyNumber(notify.data_emissao)] += 1;
			}
		});

		const multas = await this.prisma.notificacao.findMany({
			select: { data_emissao: true },
			where: {
				ativo: true,
				tipo_registro: 2,
				data_emissao: { gte: dataFiltro },
				pessoa: { empresa_id },
			},
		});
		const multaData = {};
		multas.forEach((multa) => {
			if (!multaData[formatDateMonthOnlyNumber(multa.data_emissao)]) {
				multaData[formatDateMonthOnlyNumber(multa.data_emissao)] = 1;
			} else {
				multaData[formatDateMonthOnlyNumber(multa.data_emissao)] += 1;
			}
		});

		const keys = [
			...new Set([...Object.keys(notData), ...Object.keys(multaData)]),
		];

		keys.forEach((k) => {
			if (!notData[k]) notData[k] = 0;
			if (!multaData[k]) multaData[k] = 0;
		});

		return { infracoes: notData, multas: multaData, keys };
	}
}
