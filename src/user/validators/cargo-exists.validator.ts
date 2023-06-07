import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { CargoRepository } from 'src/cargo/cargo.repository';

@Injectable()
@ValidatorConstraint({ name: 'CargoExists', async: true })
export class CargoExists implements ValidatorConstraintInterface {
  constructor(private readonly repository: CargoRepository) {}

  async validate(id: number) {
    try {
      const user = await this.repository.findOne({ id });

      return !!user;
    } catch (err) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `O valor do parâmetro ${args.property} informado não pode ser utilizado`;
  }
}
