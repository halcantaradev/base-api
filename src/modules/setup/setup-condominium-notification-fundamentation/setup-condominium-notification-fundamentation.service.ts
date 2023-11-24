import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSetupCondominiumNotificationFundamentationDto } from './dto/create-setup-condominium-notification-fundamentation.dto';
import { UpdateSetupCondominiumNotificationFundamentationDto } from './dto/update-setup-condominium-notification-fundamentation.dto';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';

@Injectable()
export class SetupCondominiumNotificationFundamentationService {
	constructor(private readonly prisma: PrismaService) {}

	async create(
		createSetupCondominiumNotificationFundamentationDto: CreateSetupCondominiumNotificationFundamentationDto,
	) {
		const hasFundamentation =
			await this.prisma.condominioHasTipoInfracao.findFirst({
				where: {
					condominio_id:
						createSetupCondominiumNotificationFundamentationDto.condominio_id,
					tipo_infracao_id:
						createSetupCondominiumNotificationFundamentationDto.tipo_infracao_id,
					excluido: false,
				},
			});
		if (hasFundamentation) {
			throw new BadRequestException(
				'Fundamentação já cadastrada para este tipo de infração',
			);
		}

		return this.prisma.condominioHasTipoInfracao.create({
			data: {
				tipo_infracao_id:
					createSetupCondominiumNotificationFundamentationDto.tipo_infracao_id,
				condominio_id:
					createSetupCondominiumNotificationFundamentationDto.condominio_id,
				fundamentacao:
					createSetupCondominiumNotificationFundamentationDto.fundamentacao,
			},
		});
	}

	findAllActive(condominio_id: number) {
		if (Number.isNaN(condominio_id)) {
			throw new BadRequestException('Condomínio inválido!');
		}

		return this.prisma.condominioHasTipoInfracao.findMany({
			select: {
				id: true,
				tipo_infracao_id: true,
				fundamentacao: true,
				tipo_infracao: { select: { descricao: true } },
			},
			where: {
				condominio_id,
				tipo_infracao: { ativo: true },
				excluido: false,
			},
		});
	}

	async update(
		id: number,
		updateSetupCondominiumNotificationFundamentationDto: UpdateSetupCondominiumNotificationFundamentationDto,
	) {
		if (Number.isNaN(id))
			throw new BadRequestException('Registro informado inválido!');

		let hasFundamentation =
			await this.prisma.condominioHasTipoInfracao.findFirst({
				where: { id, excluido: false },
			});
		if (!hasFundamentation)
			throw new BadRequestException('Registro não encontrado!');

		hasFundamentation =
			await this.prisma.condominioHasTipoInfracao.findFirst({
				where: {
					condominio_id:
						updateSetupCondominiumNotificationFundamentationDto.condominio_id,
					tipo_infracao_id:
						updateSetupCondominiumNotificationFundamentationDto.tipo_infracao_id,
					id: { not: { equals: id } },
					excluido: false,
				},
			});

		if (hasFundamentation) {
			throw new BadRequestException(
				'Fundamentação já cadastrada para este tipo de infração',
			);
		}

		return this.prisma.condominioHasTipoInfracao.update({
			data: {
				fundamentacao:
					updateSetupCondominiumNotificationFundamentationDto.fundamentacao,
				tipo_infracao_id:
					updateSetupCondominiumNotificationFundamentationDto.tipo_infracao_id,
			},
			where: { id },
		});
	}

	async remove(id: number) {
		if (Number.isNaN(id))
			throw new BadRequestException('Registro informado inválido!');
		const hasFundamentation =
			await this.prisma.condominioHasTipoInfracao.findFirst({
				where: { id, excluido: false },
			});

		if (!hasFundamentation)
			throw new BadRequestException('Registro não encontrado!');

		return this.prisma.condominioHasTipoInfracao.update({
			data: { excluido: true },
			where: { id },
		});
	}
}
