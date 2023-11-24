import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import {
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from 'class-validator';

@Injectable()
@ValidatorConstraint({ name: 'DepartmentExists', async: true })
export class DepartmentExists implements ValidatorConstraintInterface {
	constructor(private readonly prisma: PrismaService) {}

	async validate(id: number) {
		try {
			const department = await this.prisma.departamento.findFirst({
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
		return `O departamento informado não pode ser utilizado`;
	}
}
