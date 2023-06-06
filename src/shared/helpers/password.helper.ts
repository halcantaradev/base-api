import * as bcrypt from 'bcrypt';
export class PasswordHelper {
  static create(password: string) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  static compare(password: string, hash: string) {
    return bcrypt.compareSync(password, hash);
  }
}
