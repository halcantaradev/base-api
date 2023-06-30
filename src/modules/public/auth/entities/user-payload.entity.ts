export class UserPayload {
	sub: number;
	nome: string;
	empresa_id: number;
	cargo_id: number;
	departamentos_ids: number[];
	acessa_todos_departamentos: boolean;
	iat?: number;
}
