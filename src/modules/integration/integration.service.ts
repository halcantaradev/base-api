import { Inject, Injectable } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { ExternalJwtService } from 'src/shared/services/external-jwt/external-jwt.service';
import { FilaService } from 'src/shared/services/fila/fila.service';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import {
	CondominioIntegrationDto,
	PessoaUnidadeDto,
} from './dto/types-integration.dto';
import { UpdateIntegrationDto } from './dto/update-integration.dto';

@Injectable()
export class IntegrationService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly externalService: ExternalJwtService,
		private readonly filaService: FilaService,
		@Inject('NOTIFICACAO_CONSUMER_SERVICE')
		private readonly notificationService?: ClientRMQ,
		@Inject('SYNC_ERROR_LOG_SERVICE')
		private readonly syncErrorLogService?: ClientRMQ,
		@Inject('SYNC_GENERIC_LOG_SERVICE')
		private readonly syncGenericLogService?: ClientRMQ,
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
			where: { empresa_id, ativo: true, sincronizando: false },
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

	async syncCondominio(
		data: CondominioIntegrationDto,
		empresa_id: number,
		integracao_id: number,
	) {
		const tipoPessoa = await this.prisma.tiposPessoa.findFirst({
			select: { id: true },
			where: { nome: 'condominio' },
		});
		if (tipoPessoa) {
			let condominio = await this.prisma.pessoa.findFirst({
				where: {
					tipos: {
						some: {
							original_pessoa_id: data.uuid,
							tipo_id: tipoPessoa.id,
							integracao_id,
						},
					},
				},
			});

			if (!condominio) {
				condominio = await this.prisma.pessoa.findFirst({
					where: {
						tipos: {
							some: {
								original_pessoa_id: data.uuid,
								tipo_id: tipoPessoa.id,
								integracao_id: null,
							},
						},
					},
				});
			}

			if (condominio) {
				if (
					condominio.updated_at_origin <
					new Date(data.updated_at_origin)
				) {
					condominio = await this.prisma.pessoa.update({
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
							ativo: data.ativo == 1 ? true : false,
						},
						where: {
							id: condominio.id,
						},
					});
				}

				await this.prisma.pessoasHasTipos.updateMany({
					data: { integracao_id },
					where: {
						pessoa_id: condominio.id,
						tipo_id: tipoPessoa.id,
					},
				});

				await this.prisma.$disconnect();

				return condominio;
			} else {
				const condLog = await this.prisma.pessoa.findFirst({
					where: {
						tipos: {
							some: {
								original_pessoa_id: data.uuid,
								tipo_id: tipoPessoa.id,
							},
						},
					},
				});

				if (condLog) {
					await this.sendGenericLog({
						existente: condLog,
						data,
						integracao_id,
					});
				}

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
						ativo: data.ativo == 1 ? true : false,
						empresa_id,
					},
				});

				await this.prisma.pessoasHasTipos.create({
					data: {
						tipo_id: tipoPessoa.id,
						pessoa_id: cond.id,
						original_pessoa_id: data.uuid,
						integracao_id,
					},
				});
				await this.prisma.$disconnect();

				return cond;
			}
		}
		return false;
	}

	async syncUnidade(
		data: CondominioIntegrationDto,
		empresa_id: number,
		integracao_id: number,
	) {
		try {
			const condominio = await this.syncCondominio(
				data,
				empresa_id,
				integracao_id,
			);

			if (condominio) {
				let unidade = await this.getUnidade(
					data.unidade.uuid,
					condominio.id,
				);

				if (unidade) {
					if (
						unidade.updated_at_origin <
						new Date(data.unidade.updated_at_origin)
					) {
						await this.prisma.unidade.update({
							data: {
								codigo: data.unidade.codigo,
								updated_at_origin: new Date(
									data.unidade.updated_at_origin,
								),
								ativo: !!data.ativo,
							},
							where: {
								id: unidade.id,
							},
						});
					}
				} else {
					unidade = await this.prisma.unidade.create({
						data: {
							codigo: data.unidade.codigo,
							ativo: !!data.unidade.ativo,
							original_unidade_id: data.unidade.uuid,
							updated_at_origin: new Date(
								data.unidade.updated_at_origin,
							),
							condominio_id: condominio.id,
						},
					});
				}

				if (data.unidade.pessoas && data.unidade.pessoas.length) {
					await this.syncUnidadePessoa(
						data.unidade.pessoas,
						empresa_id,
						unidade.id,
						integracao_id,
					);
				}
			}
			await this.prisma.$disconnect();
		} catch (error) {
			this.sendErrorLog(data);
			console.log('========= Falha na sincronização unidades =========');
			console.log(error);
			console.log('==========================================');
		}
	}

	syncUnidadePessoa(
		data: PessoaUnidadeDto[],
		empresa_id: number,
		unidade_id: number,
		integracao_id: number,
	) {
		try {
			return Promise.all(
				data.map(async (pessoa) => {
					const tipoPessoa = await this.prisma.tiposPessoa.findFirst({
						select: { id: true },
						where: { nome: pessoa.tipo },
					});

					if (tipoPessoa) {
						let pessoaUnidade = await this.prisma.pessoa.findFirst({
							where: {
								tipos: {
									some: {
										original_pessoa_id: pessoa.uuid,
										integracao_id,
									},
								},
							},
						});

						if (!pessoaUnidade) {
							pessoaUnidade = await this.prisma.pessoa.findFirst({
								where: {
									tipos: {
										some: {
											original_pessoa_id: pessoa.uuid,
											tipo_id: tipoPessoa.id,
											integracao_id: null,
										},
									},
								},
							});
						}

						if (pessoaUnidade) {
							if (
								pessoaUnidade.updated_at_origin <
								new Date(pessoa.updated_at_origin)
							) {
								pessoaUnidade = await this.prisma.pessoa.update(
									{
										data: {
											nome: pessoa.nome,
											cnpj: pessoa.cnpj,
											numero: pessoa.numero,
											endereco: pessoa.endereco,
											cep: pessoa.cep,
											bairro: pessoa.bairro,
											cidade: pessoa.cidade,
											uf: pessoa.uf,
											updated_at_origin: new Date(
												pessoa.updated_at_origin,
											),
											ativo: !!pessoa.ativo,
										},
										where: {
											id: pessoaUnidade.id,
										},
									},
								);
							}

							await this.prisma.pessoasHasTipos.updateMany({
								data: { integracao_id },
								where: {
									pessoa_id: pessoaUnidade.id,
									tipo_id: tipoPessoa.id,
								},
							});

							await this.prisma.$disconnect();

							return pessoaUnidade;
						} else {
							const pess = await this.prisma.pessoa.create({
								data: {
									nome: pessoa.nome || 'Sem nome',
									cnpj: pessoa.cnpj,
									numero: pessoa.numero,
									endereco: pessoa.endereco,
									cep: pessoa.cep,
									bairro: pessoa.bairro,
									cidade: pessoa.cidade,
									uf: pessoa.uf,
									updated_at_origin: new Date(
										pessoa.updated_at_origin,
									),
									ativo: !!pessoa.ativo,
									empresa_id,
								},
							});
							await this.prisma.pessoasHasTipos.create({
								data: {
									tipo_id: tipoPessoa.id,
									pessoa_id: pess.id,
									original_pessoa_id: pessoa.uuid,
									integracao_id,
								},
							});
							await this.prisma.pessoasHasUnidades.create({
								data: {
									pessoa_id: pess.id,
									unidade_id,
									pessoa_tipo_id: tipoPessoa.id,
								},
							});
							await this.prisma.$disconnect();
							return pess;
						}
					}
					return false;
				}),
			);
		} catch (error) {
			this.sendErrorLog({ data });
			console.log('========= Falha na sincronização pessoa =========');
			console.log(error);
			console.log('==========================================');
		}
	}

	getUnidade(uuid: string, condominio_id: number) {
		return this.prisma.unidade.findFirst({
			where: { original_unidade_id: uuid, condominio_id },
		});
	}

	update(id: number, data: UpdateIntegrationDto) {
		return this.prisma.integracaoDatabase.update({
			data: { ...data, sincronizando: false },
			where: { id },
		});
	}

	async starSync(pattern: string, payload: any) {
		await this.sendNotification({ start: true });
		return this.filaService.publishSync(pattern, payload);
	}
	async setSyncing(id: number, status: boolean) {
		await this.prisma.integracaoDatabase.update({
			data: { sincronizando: status },
			where: { id },
		});
	}

	sendNotification(payload: any) {
		return new Promise((res, rej) => {
			this.notificationService
				.emit('synchronism', payload)
				.subscribe({ next: () => res(true), error: (err) => rej(err) });
		});
	}

	sendErrorLog(payload: any) {
		return new Promise((res, rej) => {
			this.syncErrorLogService
				.emit('sync-error-log', payload)
				.subscribe({ next: () => res(true), error: (err) => rej(err) });
		});
	}

	sendGenericLog(payload: any) {
		return new Promise((res, rej) => {
			this.syncGenericLogService
				.emit('sync-generic-log', payload)
				.subscribe({ next: () => res(true), error: (err) => rej(err) });
		});
	}

	getLastUpdate(empresa_id: number) {
		return this.prisma.integracaoDatabase.aggregate({
			_max: { data_atualizacao: true },
			where: { empresa_id, ativo: true, excluido: false },
		});
	}
}
