import { S3 } from 'aws-sdk';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { uploadFileOrigin } from './constants/upload-file-origin.constant';

@Injectable()
export class UploadFileService {
	constructor(private readonly prisma: PrismaService) {}

	async saveFiles(
		reference_id: number,
		origin: number,
		files: Express.Multer.File[],
	) {
		if (await this.validateReference(reference_id, origin))
			files.forEach(async (file) => {
				const name = uuidv4();
				const extension = path.parse(file.originalname).ext;

				await this.uploadS3(file.buffer, `${name}${extension}`);

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
		if (!uploadFileOrigin[origin]) return false;

		const retorno = await this.prisma[uploadFileOrigin[origin]].findUnique({
			where: { id: reference_id },
		});

		return !!retorno;
	}

	async uploadS3(file, name) {
		const s3 = new S3({
			accessKeyId: process.env.AWS_S3_ACCESS_KEY,
			secretAccessKey: process.env.AWS_S3_SECRET_KEY,
		});

		const params = {
			Bucket: process.env.AWS_S3_BUCKET_KEY,
			Key: String(name),
			Body: file,
		};

		return new Promise((resolve, reject) => {
			s3.upload(params, (err, data) => {
				if (err) {
					reject(err.message);
				}
				resolve(data);
			});
		});
	}
}
