import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@Injectable()
@ValidatorConstraint({ name: 'EmailNotExists', async: true })
export class EmailNotExists implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(email: string) {
    try {
      const user = await this.prisma.user.findFirst({ where: { email } });

      return !user;
    } catch (err) {
      return false;
    }
  }

  defaultMessage() {
    return `O email informado não pode ser utilizado`;
  }
}
