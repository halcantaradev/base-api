import { Prisma } from '@prisma/client';

export class CreateIntegrationDto
	implements Prisma.IntegracaoDatabaseUncheckedCreateWithoutEmpresaInput
{
	descricao: string;
	host: string;
	banco: string;
	usuario: string;
	senha: string;
	porta: number;
	token?: string;
	tipo: string;
	data_atualizacao?: string | Date;
	ativo?: boolean;
	excluido?: boolean;
}
