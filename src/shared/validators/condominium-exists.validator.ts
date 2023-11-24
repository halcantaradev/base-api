import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import {
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from 'class-validator';

@Injectable()
@ValidatorConstraint({ name: 'CondominiumExists', async: true })
export class CondominiumExists implements ValidatorConstraintInterface {
	constructor(private readonly prisma: PrismaService) {}

	async validate(id: number) {
		try {
			const condominium = await this.prisma.pessoa.findFirst({
				where: {
					id,
					tipos: {
						some: {
							tipo: {
								nome: 'condominio',
							},
						},
					},
				},
			});

			return !!condominium;
		} catch (err) {
			return false;
		}
	}

	defaultMessage() {
		return `O condomínio informado não pode ser utilizado`;
	}
}
