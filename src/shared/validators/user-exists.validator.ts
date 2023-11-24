import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import {
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from 'class-validator';

@Injectable()
@ValidatorConstraint({ name: 'UserExists', async: true })
export class UserExists implements ValidatorConstraintInterface {
	constructor(private readonly prisma: PrismaService) {}

	async validate(id: number) {
		try {
			const user = await this.prisma.user.findFirst({
				where: {
					id,
				},
			});

			return !!user;
		} catch (err) {
			return false;
		}
	}

	defaultMessage() {
		return `O usuario informado não pode ser utilizado`;
	}
}
