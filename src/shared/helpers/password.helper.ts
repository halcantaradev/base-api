import * as bcrypt from 'bcrypt';
const salt = bcrypt.genSaltSync(10);

export class PasswordHelper {
  static create(password: string) {
    return bcrypt.hashSync(password, salt);
  }

  static compare(password: string, hash: string) {
    return bcrypt.compareSync(password, hash);
  }
}
