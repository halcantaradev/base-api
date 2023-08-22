import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { CreateProtocolDto } from './dto/create-protocol.dto';
import { UpdateProtocolDto } from './dto/update-protocol.dto';
import { Prisma } from '@prisma/client';
import { UserAuth } from 'src/shared/entities/user-auth.entity';

@Injectable()
export class ProtocolService {
	constructor(private readonly prisma: PrismaService) {}

	select: Prisma.ProtocoloSelect = {
		id: true,
		tipo: true,
		origem_usuario: {
			select: {
				id: true,
				nome: true,
			},
		},
		origem_departamento: {
			select: {
				id: true,
				nome: true,
			},
		},
		destino_usuario: {
			select: {
				id: true,
				nome: true,
			},
		},
		destino_departamento: {
			select: {
				id: true,
				nome: true,
			},
		},
		retorna_malote_vazio: true,
		ativo: true,
		finalizado: true,
		created_at: true,
		updated_at: true,
	};

	create(createProtocolDto: CreateProtocolDto, origem_usuario_id: number) {
		return this.prisma.protocolo.create({
			data: {
				tipo: createProtocolDto.tipo,
				destino_departamento_id:
					createProtocolDto.destino_departamento_id,
				destino_usuario_id: createProtocolDto.destino_usuario_id,
				origem_usuario_id,
				origem_departamento_id:
					createProtocolDto.origem_departamento_id,
				retorna_malote_vazio: createProtocolDto.retorna_malote_vazio,
				ativo: true,
			},
		});
	}

	findAll(busca?: string, ativo?: boolean) {
		return this.prisma.protocolo.findMany({
			select: this.select,
			where: {
				ativo: ativo != null ? ativo : undefined,
			},
			orderBy: {
				id: 'desc',
			},
		});
	}

	findById(id: number, user: UserAuth) {
		if (Number.isNaN(id))
			throw new BadRequestException('Protocolo não encontrado');

		return this.prisma.protocolo.findFirst({
			select: this.select,
			where: {
				id,
				excluido: false,
				OR: !user.acessa_todos_departamentos
					? [
							{
								destino_departamento: {
									usuarios: {
										some: {
											usuario: {
												id: user.id,
											},
										},
									},
								},
							},
							{
								origem_departamento: {
									usuarios: {
										some: {
											usuario: {
												id: user.id,
											},
										},
									},
								},
							},
					  ]
					: undefined,
			},
		});
	}

	async update(
		id: number,
		updateProtocolDto: UpdateProtocolDto,
		user: UserAuth,
	) {
		const protocolo = this.findById(id, user);

		if (!protocolo)
			throw new BadRequestException('Protocolo não encontrado');

		return this.prisma.protocolo.update({
			data: {
				tipo: updateProtocolDto.tipo || undefined,
				destino_departamento_id:
					updateProtocolDto.destino_departamento_id || undefined,
				destino_usuario_id:
					updateProtocolDto.destino_usuario_id || undefined,
				origem_usuario_id: updateProtocolDto.origem_departamento_id
					? user.id
					: undefined,
				origem_departamento_id:
					updateProtocolDto.origem_departamento_id || undefined,
				retorna_malote_vazio:
					updateProtocolDto.retorna_malote_vazio || undefined,
				ativo: updateProtocolDto.ativo || undefined,
				finalizado: updateProtocolDto.finalizado || undefined,
			},
			where: {
				id,
			},
		});
	}
}
