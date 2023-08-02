import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import {
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from 'class-validator';

@Injectable()
@ValidatorConstraint({ name: 'TypeContractExists', async: true })
export class TypeContractExists implements ValidatorConstraintInterface {
	constructor(private readonly prisma: PrismaService) {}

	async validate(id: number) {
		try {
			const type = await this.prisma.tipoContratoCondominio.findFirst({
				where: {
					id,
				},
			});

			return !!type;
		} catch (err) {
			return false;
		}
	}

	defaultMessage() {
		return `O contrato informado não pode ser utilizado`;
	}
}
