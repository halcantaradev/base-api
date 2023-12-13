import { UpdateSetupNotificationDto } from './dto/update-setup-notification.dto';
import { PrismaService } from '../../shared/services/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateSetupSystemDto } from './dto/update-setup-system.dto';
import { UpdateSetupPackageDto } from './dto/update-setup-package.dto';
import { RouteShift } from 'src/shared/consts/route-shift.const';
import { UpdateSetupCompanyDto } from './dto/update-setup-company.dto';

@Injectable()
export class SetupService {
	constructor(private readonly prisma: PrismaService) {}

	async findSetupNotification(id: number) {
		return this.prisma.notificacaoSetup.findFirst({
			where: {
				condominio_id: id,
			},
		});
	}

	async updateSetupNotification(
		id: number,
		updateSetupNotificationDto: UpdateSetupNotificationDto,
	) {
		return this.prisma.notificacaoSetup.upsert({
			create: {
				condominio_id: id,
				primeira_reincidencia:
					updateSetupNotificationDto.primeira_reincidencia != null
						? updateSetupNotificationDto.primeira_reincidencia
						: undefined,
				primeira_reincidencia_base_pagamento:
					updateSetupNotificationDto.primeira_reincidencia_base_pagamento ||
					undefined,
				primeira_reincidencia_percentual_pagamento:
					updateSetupNotificationDto.primeira_reincidencia_percentual_pagamento ||
					undefined,
				segunda_reincidencia:
					updateSetupNotificationDto.segunda_reincidencia != null
						? updateSetupNotificationDto.segunda_reincidencia
						: undefined,
				segunda_reincidencia_base_pagamento:
					updateSetupNotificationDto.segunda_reincidencia_base_pagamento ||
					undefined,
				prazo_interpor_recurso:
					updateSetupNotificationDto.prazo_interpor_recurso ||
					undefined,
				observacoes:
					updateSetupNotificationDto.observacoes || undefined,
			},
			update: {
				primeira_reincidencia:
					updateSetupNotificationDto.primeira_reincidencia != null
						? updateSetupNotificationDto.primeira_reincidencia
						: undefined,
				primeira_reincidencia_base_pagamento:
					updateSetupNotificationDto.primeira_reincidencia_base_pagamento ||
					undefined,
				primeira_reincidencia_percentual_pagamento:
					updateSetupNotificationDto.primeira_reincidencia_percentual_pagamento ||
					undefined,
				segunda_reincidencia:
					updateSetupNotificationDto.segunda_reincidencia != null
						? updateSetupNotificationDto.segunda_reincidencia
						: undefined,
				segunda_reincidencia_base_pagamento:
					updateSetupNotificationDto.segunda_reincidencia_base_pagamento ||
					undefined,
				prazo_interpor_recurso:
					updateSetupNotificationDto.prazo_interpor_recurso ||
					undefined,
				observacoes:
					updateSetupNotificationDto.observacoes || undefined,
			},
			where: {
				condominio_id: id,
			},
		});
	}

	async findRoutesPackage(empresa_id: number) {
		const routes = await this.prisma.rota.findMany({
			select: {
				id: true,
				turno: true,
				dom: true,
				seg: true,
				ter: true,
				qua: true,
				qui: true,
				sex: true,
				sab: true,
			},
			where: {
				excluido: false,
				ativo: true,
				empresa_id,
			},
		});

		return routes.map((route) => {
			const turno = RouteShift[route.turno];

			let dias = '';

			Object.keys(route).forEach((key) => {
				if (route[key] === true) dias += `${key.toUpperCase()},`;
			});

			if (dias.length) dias = dias.slice(0, -1);

			return { id: route.id, nome: `${turno} - ${dias}` };
		});
	}

	async findBikersPackage(empresa_id: number) {
		return this.prisma.user.findMany({
			select: {
				id: true,
				nome: true,
			},
			where: {
				ativo: true,
				empresas: {
					some: {
						cargo: {
							perfil: 2,
						},
						empresa_id: empresa_id,
					},
				},
			},
		});
	}

	async findSetupPackage(id: number) {
		return this.prisma.maloteSetup.findFirst({
			where: {
				condominio_id: id,
			},
		});
	}

	async updateSetupPackage(
		id: number,
		updateSetupPackageDto: UpdateSetupPackageDto,
	) {
		return this.prisma.maloteSetup.upsert({
			create: {
				condominio_id: id,
				rota_id: updateSetupPackageDto.rota_id,
				motoqueiro_id: updateSetupPackageDto.motoqueiro_id,
				quantidade_malotes:
					updateSetupPackageDto.quantidade_malotes || 0,
			},
			update: {
				rota_id: updateSetupPackageDto.rota_id || undefined,
				motoqueiro_id: updateSetupPackageDto.motoqueiro_id || undefined,
				quantidade_malotes:
					updateSetupPackageDto.quantidade_malotes || undefined,
			},
			where: {
				condominio_id: id,
			},
		});
	}

	async findSetupSystem(id: number) {
		return this.prisma.sistemaSetup.findFirst({
			where: {
				empresa_id: id,
			},
		});
	}

	async updateSetupSystem(
		id: number,
		updateSetupSystemDto: UpdateSetupSystemDto,
	) {
		return this.prisma.sistemaSetup.upsert({
			create: {
				empresa_id: id,
				salario_minimo_base:
					updateSetupSystemDto.salario_minimo_base != null
						? updateSetupSystemDto.salario_minimo_base
						: 0,
				sancao:
					updateSetupSystemDto.sancao != null
						? updateSetupSystemDto.sancao
						: '',
				texto_padrao_notificacao:
					updateSetupSystemDto.texto_padrao_notificacao != null
						? updateSetupSystemDto.texto_padrao_notificacao
						: '',
				obriga_malote_fisico:
					updateSetupSystemDto.obriga_malote_fisico != null
						? updateSetupSystemDto.obriga_malote_fisico
						: undefined,
			},
			update: {
				salario_minimo_base:
					updateSetupSystemDto.salario_minimo_base != null
						? updateSetupSystemDto.salario_minimo_base
						: 0,
				sancao:
					updateSetupSystemDto.sancao != null
						? updateSetupSystemDto.sancao
						: undefined,
				texto_padrao_notificacao:
					updateSetupSystemDto.texto_padrao_notificacao != null
						? updateSetupSystemDto.texto_padrao_notificacao
						: undefined,
				obriga_malote_fisico:
					updateSetupSystemDto.obriga_malote_fisico != null
						? updateSetupSystemDto.obriga_malote_fisico
						: undefined,
			},
			where: {
				empresa_id: id,
			},
		});
	}

	async findOneCompany(empresa_id: number) {
		const empresa = await this.prisma.pessoa.findUnique({
			where: {
				id: empresa_id,
			},
		});

		if (!empresa) throw new BadRequestException('Empresa não encontrada');

		return empresa;
	}

	async updateCompany(
		updateSetupCompanyDto: UpdateSetupCompanyDto,
		empresa_id: number,
	) {
		await this.findOneCompany(empresa_id);

		return this.prisma.pessoa.update({
			data: {
				nome: updateSetupCompanyDto.nome || undefined,
				cnpj: updateSetupCompanyDto.cnpj || undefined,
				numero: updateSetupCompanyDto.numero || undefined,
				endereco: updateSetupCompanyDto.endereco || undefined,
				cep: updateSetupCompanyDto.cep || undefined,
				bairro: updateSetupCompanyDto.bairro || undefined,
				cidade: updateSetupCompanyDto.cidade || undefined,
				uf: updateSetupCompanyDto.uf || undefined,
			},
			where: {
				id: empresa_id,
			},
		});
	}
}
