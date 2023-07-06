import { UpdateSetupNotificationDto } from './dto/update-setup-notification.dto';
import { PrismaService } from './../../shared/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { UpdateSetupSystemDto } from './dto/update-setup-system.dto';

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

	async findSetupSystem() {
		return this.prisma.sistemaSetup.findFirst();
	}

	async updateSetupSystem(updateSetupSystemDto: UpdateSetupSystemDto) {
		return this.prisma.sistemaSetup.upsert({
			create: {
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
			},
			where: {
				id: 1,
			},
		});
	}
}
