export class CondominioIntegrationDto {
	uuid: string;
	nome: string;
	cnpj?: string;
	numero?: string;
	endereco?: string;
	cep?: string;
	bairro?: string;
	cidade?: string;
	uf?: string;
	updated_at_origin?: string;
	ativo: number;
	current_date_update?: string;
	unidade?: UnidadeIntegrationDto;
}

export class UnidadeIntegrationDto {
	uuid: string;
	codigo: string;
	updated_at_origin: string;
	ativo: number;
	pessoas?: PessoaUnidadeDto[];
}

export class PessoaUnidadeDto {
	uuid: string;
	nome: string;
	tipo: string;
	cnpj?: string;
	numero?: string;
	endereco?: string;
	cep?: string;
	bairro?: string;
	cidade?: string;
	uf?: string;
	updated_at_origin?: string;
	ativo: number;
	current_date_update?: string;
}
