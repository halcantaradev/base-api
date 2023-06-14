import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsBoolenType', async: false })
export class IsBooleanType implements ValidatorConstraintInterface {
  validate(value: string | boolean) {
    if (value == null) return true;

    if (typeof value == 'boolean') return true;

    return ['true', 'false', '1', '0'].includes(value);
  }

  defaultMessage(args: ValidationArguments) {
    return `O campo ${args.property} informado não é válido. Por favor, forneça um ${args.property} válido.`;
  }
}
