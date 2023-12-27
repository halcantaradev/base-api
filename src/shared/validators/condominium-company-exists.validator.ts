import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import {
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from 'class-validator';

@Injectable()
@ValidatorConstraint({ name: 'CondominiumOrCompanyExists', async: true })
export class CondominiumOrCompanyExists
	implements ValidatorConstraintInterface
{
	constructor(private readonly prisma: PrismaService) {}

	async validate(id: number) {
		try {
			const condominium = await this.prisma.pessoa.findFirst({
				where: {
					id,
					tipos: {
						some: {
							tipo: {
								nome: {
									in: ['empresa', 'condominio'],
								},
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
		return `O condomínio/empresa informado não pode ser utilizado`;
	}
}
