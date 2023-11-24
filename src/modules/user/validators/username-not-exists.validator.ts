import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import {
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from 'class-validator';

@Injectable()
@ValidatorConstraint({ name: 'UsernameNotExists', async: true })
export class UsernameNotExists implements ValidatorConstraintInterface {
	constructor(private readonly prisma: PrismaService) {}

	async validate(username: string) {
		try {
			const user = await this.prisma.user.findFirst({
				where: { username },
			});

			return !user;
		} catch (err) {
			return false;
		}
	}

	defaultMessage() {
		return `O usuário informado não pode ser utilizado`;
	}
}
