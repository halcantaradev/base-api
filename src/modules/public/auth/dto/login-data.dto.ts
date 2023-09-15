export class LoginDataDto {
	id: number;
	nome: string;
	empresa_id: number;
	cargo_id: number;
	departamentos_ids: number[];
	acessa_todos_departamentos: boolean;
	primeiro_acesso?: boolean;
}
