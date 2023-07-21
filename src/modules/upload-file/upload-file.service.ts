import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { uploadFileOrigin } from './constants/upload-file-origin.constant';
import { S3Service } from 'src/shared/services/s3.service';

@Injectable()
export class UploadFileService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly s3Service: S3Service,
	) {}

	async saveFiles(
		reference_id: number,
		origin: number,
		files: Express.Multer.File[],
	) {
		if (await this.validateReference(reference_id, origin))
			await Promise.all(
				files.map(async (file) => {
					const url = await this.s3Service.upload(
						file.buffer,
						`${uuidv4()}${path.parse(file.originalname).ext}`,
					);

					await this.prisma.arquivo.create({
						data: {
							url,
							nome: file.originalname,
							origem: origin,
							referencia_id: reference_id,
						},
					});
				}),
			);
		else
			throw new BadRequestException(
				'Ocorreu um erro ao salvar o arquivo',
			);
	}

	async removeFiles(id: number[]) {
		const result = await this.prisma.arquivo.updateMany({
			data: {
				ativo: false,
			},
			where: {
				id: {
					in: id,
				},
			},
		});

		return !!result;
	}

	async validateReference(
		reference_id: number,
		origin: number,
	): Promise<boolean> {
		if (!uploadFileOrigin[origin]) return false;

		const retorno = await this.prisma[uploadFileOrigin[origin]].findUnique({
			where: { id: reference_id },
		});

		return !!retorno;
	}
}
