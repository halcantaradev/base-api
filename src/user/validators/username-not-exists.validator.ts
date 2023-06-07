import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { UserRepository } from '../user.repository';

@Injectable()
@ValidatorConstraint({ name: 'UsernameNotExists', async: true })
export class UsernameNotExists implements ValidatorConstraintInterface {
  constructor(private readonly repository: UserRepository) {}

  async validate(username: string) {
    try {
      const user = await this.repository.findOne({ username });

      return !user;
    } catch (err) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `O valor do parâmetro ${args.property} informado não pode ser utilizado`;
  }
}
