import { Inject, Injectable } from '@nestjs/common';
import { ExternalJwtService } from 'src/shared/services/external-jwt/external-jwt.service';
import { FilaService } from 'src/shared/services/fila/fila.service';
import { PrismaService } from 'src/shared/services/prisma.service';
import { UpdateIntegrationDto } from './dto/update-integration.dto';
import { ClientRMQ } from '@nestjs/microservices';

@Injectable()
export class IntegrationService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly externalService: ExternalJwtService,
		private readonly filaService: FilaService,
		@Inject('NOTIFICACAO_CONSUMER_SERVICE')
		private readonly notificationService?: ClientRMQ,
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

	generateApiTokenAccess(payload: any, id: number) {
		const token = this.externalService.generateTokenBySecret(
			process.env.SECRET,
			payload,
		);

		return this.prisma.integracaoDatabase.update({
			data: { token },
			where: { id },
		});
	}

	getUserByToken(token: string) {
		this.externalService.getPayload(token, process.env.SECRET);
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
			} else {
				return false;
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

	async syncUnidade(data: any) {
		const condominio = await this.prisma.pessoa.findFirst({
			where: {
				tipos: { some: { original_pessoa_id: data.condominio_uuid } },
			},
		});

		const unidade = await this.prisma.unidade.findFirst({
			where: { original_unidade_id: data.unidade_uuid },
		});

		if (unidade && condominio) {
			if (
				condominio.updated_at_origin < new Date(data.updated_at_origin)
			) {
				return await this.prisma.unidade.update({
					data: {
						codigo: data.codigo,
						updated_at_origin: new Date(data.updated_at_origin),
						ativo: !!data.ativo,
					},
					where: {
						id: unidade.id,
					},
				});
			} else {
				return false;
			}
		} else {
			const tipoPessoa = await this.prisma.tiposPessoa.findFirst({
				select: { id: true },
				where: { nome: 'proprietario' },
			});

			const unid = await this.prisma.unidade.create({
				data: {
					codigo: data.codigo,
					ativo: !!data.ativo,
					original_unidade_id: data.unidade_uuid,
					updated_at_origin: new Date(data.updated_at_origin),
					condominio_id: condominio.id,
				},
			});

			return await this.prisma.pessoasHasUnidades.create({
				data: {
					pessoa_tipo_id: tipoPessoa.id,
					pessoa_id: condominio.id, //aqui entra id do proprientario
					unidade_id: unid.id,
				},
			});
		}
	}
	update(id: number, data: UpdateIntegrationDto) {
		return this.prisma.integracaoDatabase.update({ data, where: { id } });
	}

	async starSync(pattern: string, payload: any) {
		await this.sendNotification({ start: true });
		return this.filaService.publishSync(pattern, payload);
	}

	sendNotification(payload: any) {
		return new Promise((res, rej) => {
			this.notificationService
				.emit('synchronism', payload)
				.subscribe({ next: () => res(true), error: (err) => rej(err) });
		});
	}
}
