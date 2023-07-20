import {
	CompleteMultipartUploadCommand,
	CreateMultipartUploadCommand,
	PutObjectCommand,
	S3Client,
	UploadPartCommand,
} from '@aws-sdk/client-s3';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class S3Service {
	config;

	constructor() {
		this.config = new S3Client({
			region: process.env.AWS_S3_REGION_KEY,
			credentials: {
				accessKeyId: process.env.AWS_S3_ACCESS_KEY,
				secretAccessKey: process.env.AWS_S3_SECRET_KEY,
			},
		});
	}

	async upload(file: Buffer, name) {
		try {
			const params = {
				Bucket: process.env.AWS_S3_BUCKET_KEY,
				Key: String(name),
				Body: file,
			};

			if (file.length >= 20 * 1024 * 1024) {
				delete params.Body;

				const multipartUpload = await this.config.send(
					new CreateMultipartUploadCommand({
						...params,
						ACL: 'public-read',
					}),
				);

				const uploadId = multipartUpload.UploadId;

				const uploadPromises = [];

				const partSize = Math.ceil(file.length / 5);

				for (let i = 0; i < 5; i++) {
					const start = i * partSize;
					const end = start + partSize;

					uploadPromises.push(
						this.config
							.send(
								new UploadPartCommand({
									...params,
									UploadId: uploadId,
									Body: file.subarray(start, end),
									PartNumber: i + 1,
								}),
							)
							.then((d) => {
								console.log('Part', i + 1, 'uploaded');
								return d;
							}),
					);
				}
				const uploadResults = await Promise.all(uploadPromises);

				await this.config.send(
					new CompleteMultipartUploadCommand({
						...params,
						UploadId: uploadId,
						MultipartUpload: {
							Parts: uploadResults.map(({ ETag }, i) => ({
								ETag,
								PartNumber: i + 1,
							})),
						},
					}),
				);
			} else {
				await this.config.send(
					new PutObjectCommand({ ...params, ACL: 'public-read' }),
				);
			}

			return `https://${params.Bucket}.s3.${process.env.AWS_S3_REGION_KEY}.amazonaws.com/${params.Key}`;
		} catch (err) {
			throw new InternalServerErrorException(err.message);
		}
	}
}
