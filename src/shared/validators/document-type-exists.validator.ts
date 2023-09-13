import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import {
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from 'class-validator';

@Injectable()
@ValidatorConstraint({ name: 'DocumentTypeExists', async: true })
export class DocumentTypeExists implements ValidatorConstraintInterface {
	constructor(private readonly prisma: PrismaService) {}

	async validate(id: number) {
		try {
			const department = await this.prisma.tipoDocumento.findFirst({
				where: {
					id,
				},
			});

			return !!department;
		} catch (err) {
			return false;
		}
	}

	defaultMessage() {
		return `O tipo informado não pode ser utilizado`;
	}
}
