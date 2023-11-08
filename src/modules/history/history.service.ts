import { BadRequestException, Injectable } from '@nestjs/common';
import { setCustomHour } from 'src/shared/helpers/date.helper';
import { PrismaService } from 'src/shared/services/prisma.service';
import { FiltersProtocolDocumentHistoryDto } from './dto/filters-protocol-document-history.dto';
import { ProtocolHistorySituation } from 'src/shared/consts/protocol-history-situation.const';

@Injectable()
export class HistoryService {
	constructor(private readonly prisma: PrismaService) {}

	findAllProtocolDocumentHistorySituations() {
		return Object.values(ProtocolHistorySituation)
			.filter((situation) => !Number.isNaN(+situation))
			.map((situation) => {
				return {
					id: situation,
					descricao: ProtocolHistorySituation.DESCRICAO[situation],
				};
			});
	}

	findAllProtocolDocumentHistory(
		documento_id: number,
		filtersProtocolDocumentHistoryDto: FiltersProtocolDocumentHistoryDto,
	) {
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
				situacao:
					filtersProtocolDocumentHistoryDto.situacao || undefined,
				usuario_id:
					filtersProtocolDocumentHistoryDto.usuario_id || undefined,
				created_at: {
					gte: filtersProtocolDocumentHistoryDto?.data_registro
						? setCustomHour(
								filtersProtocolDocumentHistoryDto
									?.data_registro[0],
						  )
						: undefined,
					lte: filtersProtocolDocumentHistoryDto?.data_registro
						? setCustomHour(
								filtersProtocolDocumentHistoryDto
									?.data_registro[1],
								23,
								59,
								59,
						  )
						: undefined,
				},
			},
		});
	}
}
