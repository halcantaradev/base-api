import { UserEntity } from "../entities/user.entity";

export class CreateUserDto extends UserEntity{
  email: string;
  username: string;
  password: string;
  secret: string;
  ativo: boolean;
  created_at: Date;
  updateda_at: Date;
}
