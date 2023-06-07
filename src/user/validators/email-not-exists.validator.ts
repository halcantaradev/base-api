import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { UserRepository } from '../user.repository';

@Injectable()
@ValidatorConstraint({ name: 'EmailNotExists', async: true })
export class EmailNotExists implements ValidatorConstraintInterface {
  constructor(private readonly repository: UserRepository) {}

  async validate(email: string) {
    try {
      const user = await this.repository.findOne({ email });

      return !user;
    } catch (err) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `O valor do parâmetro ${args.property} informado não pode ser utilizado`;
  }
}
