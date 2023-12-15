export class LoginDataDto {
	id: number;
	nome: string;
	username?: string;
	email?: string;
	empresa_id: number;
	cargo_id: number;
	departamentos_ids: number[];
	acessa_todos_departamentos: boolean;
	primeiro_acesso?: boolean;
	rocket_token?: string;
}
