import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {
	ValidatorConstraint,
	ValidatorConstraintInterface,
	ValidationArguments,
} from 'class-validator';

@Injectable()
@ValidatorConstraint({ name: 'UserValidator', async: true })
export class DbValidator implements ValidatorConstraintInterface {
	columnName;
	tableName;

	constructor(
		{ columnName, tableName },
		private readonly prisma: PrismaClient,
	) {
		this.columnName = columnName;
		this.tableName = tableName;
	}

	async validate(valor) {
		try {
			const data = await this.prisma[this.tableName].findOne({
				[this.columnName]: valor,
			});

			return !!data;
		} catch (err) {
			return false;
		}
	}

	defaultMessage(args: ValidationArguments) {
		return `O valor do parâmetro ${args.property} informado não pode ser utilizado`;
	}
}
