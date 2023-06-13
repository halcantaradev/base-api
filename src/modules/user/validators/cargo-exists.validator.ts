import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@Injectable()
@ValidatorConstraint({ name: 'CargoExists', async: true })
export class CargoExists implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(id: number) {
    try {
      const cargo = await this.prisma.cargo.findFirst({
        where: {
          id,
        },
      });

      return !!cargo;
    } catch (err) {
      return false;
    }
  }

  defaultMessage() {
    return `O cargo informado não pode ser utilizado`;
  }
}
