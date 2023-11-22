import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { uploadFileOrigin } from './constants/upload-file-origin.constant';
import { S3Service } from 'src/shared/services/s3.service';
import { UploadFileDto } from './dto/upload-file.dto';
import { FilesOrigin } from 'src/shared/consts/file-origin.const';
import { ProtocolHistorySituation } from 'src/shared/consts/protocol-history-situation.const';

@Injectable()
export class UploadFileService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly s3Service: S3Service,
	) {}

	async saveFiles(
		params: UploadFileDto,
		files: Express.Multer.File[],
		user_id: number,
	) {
		const validation = await this.validateReference(
			params.reference_id,
			params.origin,
		);

		if (!validation)
			throw new BadRequestException(
				'Ocorreu um erro ao salvar o arquivo',
			);

		await Promise.all(
			files.map(async (file, index) => {
				const keyName = `${uuidv4()}${
					path.parse(file.originalname).ext
				}`;
				const url = await this.s3Service.upload(
					file.buffer,
					`${FilesOrigin.EXTENSO[params.origin]}/${keyName}`,
				);

				await this.prisma.arquivo.create({
					data: {
						url,
						nome: Buffer.from(file.originalname, 'latin1').toString(
							'utf8',
						),
						key: keyName,
						origem: params.origin,
						referencia_id: params.reference_id,
						descricao: JSON.parse(params.descricao)[index],
						tipo: path
							.parse(file.originalname)
							.ext.replace('.', ''),
					},
				});
			}),
		);

		await this.registerHistory(
			files.map((file) => file.originalname),
			params.reference_id,
			params.origin,
			user_id,
		);
	}

	async removeFiles(ids: number[], user_id: number) {
		const result = await this.prisma.arquivo.updateMany({
			data: {
				ativo: false,
			},
			where: {
				id: {
					in: ids,
				},
			},
		});

		if (result) {
			const files = await this.prisma.arquivo.findMany({
				where: {
					id: { in: ids },
				},
			});

			await this.registerHistory(
				files.map((file) => file.nome),
				files[0].referencia_id,
				files[0].origem,
				user_id,
				true,
			);
		}

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

	async registerHistory(
		files: string[],
		reference_id: number,
		origin: number,
		user_id: number,
		remove = false,
	) {
		switch (origin) {
			case FilesOrigin.PROTOCOL:
				let text = '';
				files.forEach((file) => {
					text += `<li>${file}</li>`;
				});

				await this.prisma.protocoloDocumentoHistorico.create({
					data: {
						documento_id: reference_id,
						usuario_id: user_id,
						situacao: ProtocolHistorySituation.ATUALIZADO,
						descricao: `${
							remove ? 'Anexos removidos' : 'Anexos adicionados'
						}:<br><ul>${text}<ul>`,
					},
				});
				break;
			default:
				break;
		}
	}
}
