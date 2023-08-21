import { Injectable } from '@nestjs/common';
import { ExternalJwtService } from 'src/shared/services/external-jwt/external-jwt.service';
import { PrismaService } from 'src/shared/services/prisma.service';
import { UpdateIntegrationDto } from './dto/update-integration.dto';

@Injectable()
export class IntegrationService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly externalService: ExternalJwtService,
	) {}

	findAllByEmpresa(empresa_id: number) {
		return this.prisma.integracaoDatabase.findMany({
			select: {
				id: true,
				host: true,
				banco: true,
				usuario: true,
				senha: true,
				porta: true,
				token: true,
				data_atualizacao: true,
			},
			where: { empresa_id, ativo: true },
		});
	}

	generateApiTokenAccess(payload: any) {
		return this.externalService.generateTokenBySecret(
			process.env.SECRET,
			payload,
		);
	}

	generatePayloadFila(payload: any) {
		return this.externalService.generateTokenBySecret(
			process.env.SYNC_ENCRYPT_SECRET,
			payload,
		);
	}

	getLastUpdatedCondominio(empresa_id: number) {
		return this.prisma
			.$queryRaw`select max(P.updated_at_origin) as last_date_updated from pessoas P
		left join pessoas_has_tipo PHT on PHT.pessoa_id = P.id
		left join tipos_pessoas TP on TP.id = PHT.tipo_id
			where TP.nome = 'condominio' and empresa_id = ${empresa_id};`;
	}

	async syncCondominio(data: any, empresa_id: number) {
		const condominio = await this.prisma.pessoa.findFirst({
			where: { tipos: { some: { original_pessoa_id: data.uuid } } },
		});

		const tipoPessoa = await this.prisma.tiposPessoa.findFirst({
			select: { id: true },
			where: { nome: 'condominio' },
		});
		if (condominio) {
			if (
				condominio.updated_at_origin < new Date(data.updated_at_origin)
			) {
				return await this.prisma.pessoa.update({
					data: {
						nome: data.nome,
						cnpj: data.cnpj,
						numero: data.numero,
						endereco: data.endereco,
						cep: data.cep,
						bairro: data.bairro,
						cidade: data.cidade,
						uf: data.uf,
						updated_at_origin: new Date(data.updated_at_origin),
						ativo: !!data.ativo,
					},
					where: {
						id: condominio.id,
					},
				});
			}
		} else {
			const cond = await this.prisma.pessoa.create({
				data: {
					nome: data.nome,
					cnpj: data.cnpj,
					numero: data.numero,
					endereco: data.endereco,
					cep: data.cep,
					bairro: data.bairro,
					cidade: data.cidade,
					uf: data.uf,
					updated_at_origin: new Date(data.updated_at_origin),
					ativo: !!data.ativo,
					empresa_id,
				},
			});

			return await this.prisma.pessoasHasTipos.create({
				data: {
					tipo_id: tipoPessoa.id,
					pessoa_id: cond.id,
					original_pessoa_id: data.uuid,
				},
			});
		}
	}

	update(id: number, data: UpdateIntegrationDto) {
		return this.prisma.integracaoDatabase.update({ data, where: { id } });
	}
}
