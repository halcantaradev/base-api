import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { FileOrigin } from 'src/shared/enum/file-origin.enum';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class FileService {
	constructor(private readonly prisma: PrismaService) {}

	async saveFiles(
		reference_id: number,
		origin: FileOrigin,
		files: Express.Multer.File[],
	) {
		if (await this.validateReference(reference_id, origin))
			files.forEach(async (file) => {
				await this.prisma.arquivo.create({
					data: {
						url: `http://localhost/${file.filename}`,
						origem: origin,
						referencia_id: reference_id,
					},
				});
			});
		else
			throw new BadRequestException(
				'Ocorreu um erro ao salvar o arquivo',
			);
	}

	async validateReference(
		reference_id: number,
		origin: FileOrigin,
	): Promise<boolean> {
		let retorno = null;

		if (origin == FileOrigin.Notification)
			retorno = await this.prisma.notificacao.findUnique({
				where: { id: reference_id },
			});

		return !!retorno;
	}
}
