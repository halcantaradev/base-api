export class Person {
	id: number;
	nome: string;
	cnpj: string;
	endereco?: string;
	cep?: string;
	bairro?: string;
	cidade?: string;
	uf?: string;
	ativa: boolean;
	contato: { contato: string }[];
}
