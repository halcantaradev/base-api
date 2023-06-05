import { EmpresasHasUsuarios, User } from '@prisma/client';

export class UserEntity implements User {
  id: number;
  nome: string;
  email: string;
  username: string;
  password: string;
  secret: string;
  ativo: boolean;
  created_at: Date;
  updateda_at: Date;
  empresas_has_usuarios?: EmpresasHasUsuarios[];
}
