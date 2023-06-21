import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { fileUploadOrigin } from './constants/file-upload-origin.constant';

@Injectable()
export class FileUploadService {
	constructor(private readonly prisma: PrismaService) {}

	async saveFiles(
		reference_id: number,
		origin: number,
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
		origin: number,
	): Promise<boolean> {
		if (!fileUploadOrigin[origin]) return false;

		const retorno = await this.prisma[fileUploadOrigin[origin]].findUnique({
			where: { id: reference_id },
		});

		return !!retorno;
	}
}
