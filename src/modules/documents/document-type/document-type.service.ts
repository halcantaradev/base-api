import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDocumentTypeDto } from './dto/create-document-type.dto';
import { UpdateDocumentTypeDto } from './dto/update-document-type.dto';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class DocumentTypeService {
	constructor(private readonly prisma: PrismaService) {}

	async create(createDocumentTypeDto: CreateDocumentTypeDto) {
		const alreadyexists = await this.prisma.tipoDocumento.findMany({
			where: {
				nome: createDocumentTypeDto.nome,
			},
		});

		if (
			alreadyexists &&
			alreadyexists.some((item) => item.excluido === false)
		) {
			throw new BadRequestException('Nome de documento já cadastrado', {
				cause: new Error(),
				description: 'Por favor use um nome diferente',
			});
		} else if (
			alreadyexists &&
			alreadyexists.some((item) => item.excluido === true)
		) {
			return this.prisma.tipoDocumento.create({
				data: createDocumentTypeDto,
			});
		} else {
			return this.prisma.tipoDocumento.create({
				data: createDocumentTypeDto,
			});
		}
	}

	async findOne(id: number) {
		return this.prisma.tipoDocumento.findUnique({
			where: {
				id,
			},
		});
	}

	async findAll(ativo?: boolean) {
		return this.prisma.tipoDocumento.findMany({
			select: {
				id: true,
				nome: true,
				ativo: true,
				created_at: true,
				updated_at: true,
			},
			where: {
				excluido: false,
				ativo: ativo != null ? ativo : undefined,
			},
		});
	}

	async update(id: number, updateDocumentTypeDto: UpdateDocumentTypeDto) {
		if (Number.isNaN(id)) {
			throw new BadRequestException('Tipo de documento não encontrado');
		}

		const documentTypeExists = await this.prisma.tipoDocumento.findFirst({
			where: {
				id: {
					not: id,
				},
				nome: {
					contains: updateDocumentTypeDto.nome,
					mode: 'insensitive',
				},
			},
		});

		if (documentTypeExists) {
			throw new BadRequestException('Nome de documento já cadastrado');
		}

		return this.prisma.tipoDocumento.update({
			data: {
				ativo: updateDocumentTypeDto.ativo,
				nome: updateDocumentTypeDto.nome,
			},
			where: {
				id,
			},
		});
	}

	async remove(id: number) {
		const documentTypeExistsOrAlreadyDeleted =
			await this.prisma.tipoDocumento.findFirst({
				where: {
					id,
					excluido: false,
				},
			});

		if (Number.isNaN(id) || !documentTypeExistsOrAlreadyDeleted) {
			throw new BadRequestException(
				'Tipo de documento não existe ou já excluído',
				{
					cause: new Error(),
					description: 'Nome de documento não existe ou já excluído',
				},
			);
		} else {
			return this.prisma.tipoDocumento.update({
				data: {
					excluido: true,
				},
				where: {
					id,
				},
			});
		}
	}
}
