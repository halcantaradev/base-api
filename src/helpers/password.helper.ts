import * as bcrypt from 'bcrypt';
export class PasswordHelper {
  static create(password: string) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }
}
