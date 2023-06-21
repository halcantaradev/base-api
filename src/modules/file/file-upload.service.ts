import { BadRequestException, Injectable } from '@nestjs/common';
import { FileUploadOrigin } from 'src/shared/enum/file-upload-origin.enum';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class FileUploadService {
	constructor(private readonly prisma: PrismaService) {}

	async saveFiles(
		reference_id: number,
		origin: FileUploadOrigin,
		files: Express.Multer.File[],
	) {
		if (await this.validateReference(reference_id, origin))
			files.forEach(async (file) => {
				console.log(file);

				await this.prisma.arquivo.create({
					data: {
						url: `http://localhost/${file.originalname}`,
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
		origin: FileUploadOrigin,
	): Promise<boolean> {
		let retorno = null;

		if (origin == FileUploadOrigin.Notification)
			retorno = await this.prisma.notificacao.findUnique({
				where: { id: reference_id },
			});

		return !!retorno;
	}
}
