import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class HistoryService {
	constructor(private readonly prisma: PrismaService) {}

	findAllProtocolDocumentHistory(documento_id: number) {
		if (Number.isNaN(documento_id)) {
			throw new BadRequestException('Documento não encontrado');
		}

		return this.prisma.protocoloDocumentoHistorico.findMany({
			select: {
				id: true,
				situacao: true,
				descricao: true,
				created_at: true,
				usuario: {
					select: {
						id: true,
						nome: true,
					},
				},
			},
			where: {
				documento_id,
			},
		});
	}
}
