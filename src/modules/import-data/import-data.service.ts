import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PasswordHelper } from 'src/shared/helpers/password.helper';
import { PrismaService } from 'src/shared/services/prisma.service';
import { WorkSheet, read, utils } from 'xlsx';

@Injectable()
export class ImportDataService {
	constructor(private readonly prisma: PrismaService) {}

	readDataFromXlsx(file: Express.Multer.File) {
		const xlsx = read(file.buffer);
		return xlsx.Sheets;
	}

	getJsonFromSheet(sheet: WorkSheet): any {
		return utils.sheet_to_json(sheet);
	}

	async importData(file: Express.Multer.File, empresa_id: number) {
		try {
			const data = this.readDataFromXlsx(file);
			await this.importCargos(this.getJsonFromSheet(data['cargos']));
			await this.importTipoContratos(
				this.getJsonFromSheet(data['planos']),
			);
			await this.importFiliais(
				this.getJsonFromSheet(data['filiais']),
				empresa_id,
			);
			await this.importNacs(
				this.getJsonFromSheet(data['nacs']),
				empresa_id,
			);
			await this.importUsuarios(
				this.getJsonFromSheet(data['usuarios']),
				empresa_id,
			);
			await this.importCondominios(
				this.getJsonFromSheet(data['condominios']),
				empresa_id,
			);

			return { success: true, message: 'Dados importados com sucesso!' };
		} catch (error) {
			throw new BadRequestException('Houve um erro inesperado');
		}
	}

	async importCondominios(
		condominios: {
			identificador: string | null;
			nac: string;
			tipo_contrato: string;
			nome: string;
			endereco: string;
			bairro: string;
			cidade: string;
			uf: string;
			cep: string;
		}[],
		empresa_id: number,
	) {
		condominios.forEach(async (condominio) => {
			if (condominio.identificador) {
				const condominioExists =
					await this.prisma.pessoasHasTipos.findFirst({
						where: { original_pessoa_id: condominio.identificador },
					});

				if (condominioExists) {
					const nac = condominio.nac
						? await this.prisma.departamento.findFirst({
								where: { nome: condominio.nac },
						  })
						: null;

					const condominioDepExist = nac
						? await this.prisma.condominioHasDepartamentos.findFirst(
								{
									where: {
										departamento_id: nac.id,
										condominio_id:
											condominioExists.pessoa_id,
									},
								},
						  )
						: null;
					if (!condominioDepExist && nac) {
						await this.prisma.condominioHasDepartamentos.create({
							data: {
								departamento_id: nac.id,
								condominio_id: condominioExists.pessoa_id,
							},
						});
					}
				}
			} else {
				const condominioExists = await this.prisma.pessoa.create({
					data: {
						nome: condominio.nome,
						endereco: condominio.endereco,
						bairro: condominio.bairro,
						cidade: condominio.cidade,
						uf: condominio.uf,
						cep: condominio.cep,
						empresa_id,
						importado: false,
					},
				});

				const tipoCond = await this.prisma.tiposPessoa.findFirst({
					where: { nome: 'condominio' },
				});

				if (tipoCond && condominioExists) {
					await this.prisma.pessoasHasTipos.create({
						data: {
							pessoa_id: condominioExists.id,
							tipo_id: tipoCond.id,
						},
					});
				}

				const tipoContrato = condominio.tipo_contrato
					? await this.prisma.tipoContratoCondominio.findFirst({
							where: { nome: condominio.tipo_contrato },
					  })
					: null;
				if (tipoContrato) {
					await this.prisma.condominiosHasTiposContrato.create({
						data: {
							condominio_id: condominioExists.id,
							tipo_contrato_id: tipoContrato.id,
						},
					});
				}
				const nac = condominio.nac
					? await this.prisma.departamento.findFirst({
							where: { nome: condominio.nac },
					  })
					: null;
				if (nac) {
					await this.prisma.condominioHasDepartamentos.create({
						data: {
							condominio_id: condominioExists.id,
							departamento_id: nac.id,
						},
					});
				}
			}
		});
	}

	async importUsuarios(
		usuarios: {
			usuario: string;
			nome: string;
			email: string;
			ramal: string;
			telefone: string;
			whatsapp: string;
			nac: string;
			cargo: string;
		}[],
		empresa_id: number,
	) {
		for await (const usuario of usuarios) {
			const usernameExist = await this.prisma.user.findFirst({
				where: { username: usuario.usuario },
			});
			const userEmailExist = await this.prisma.user.findFirst({
				where: { email: usuario.email },
			});

			if (!usernameExist && !userEmailExist && !!usuario.email) {
				const userCreated = await this.prisma.user.create({
					data: {
						nome: usuario.nome,
						username: usuario.usuario,
						email: usuario.email,
						telefone: (usuario.telefone || '').toString(),
						ramal: (usuario.ramal || '').toString(),
						whatsapp: (usuario.whatsapp || '').toString(),
						password: PasswordHelper.create('123456'),
						acessa_todos_departamentos: false,
					},
				});

				if (usuario.nac) {
					const nac = await this.prisma.departamento.findFirst({
						where: { nome: usuario.nac },
					});

					await this.prisma.usuarioHasDepartamentos.create({
						data: {
							departamento_id: nac.id,
							usuario_id: userCreated.id,
						},
					});
				}

				let cargo = await this.prisma.cargo.findFirst({
					where: { nome: usuario.cargo },
				});

				if (!cargo) {
					cargo = await this.prisma.cargo.findFirst({
						where: { nome: 'Não definido' },
					});
				}

				await this.prisma.empresasHasUsuarios.create({
					data: {
						empresa_id,
						cargo_id: cargo.id,
						usuario_id: userCreated.id,
					},
				});
			}
		}
	}

	async importFiliais(
		filiais: Prisma.FilialUncheckedCreateInput[],
		empresa_id: number,
	) {
		for await (const filial of filiais) {
			const filialExists = await this.prisma.filial.findFirst({
				where: { nome: filial.nome },
			});

			if (!filialExists) {
				await this.prisma.filial.create({
					data: { nome: filial.nome, empresa_id: empresa_id },
				});
			}
		}
	}

	async importNacs(
		nacs: { nome: string; filial: string }[],
		empresa_id: number,
	) {
		for await (const nac of nacs) {
			const nacExists = await this.prisma.departamento.findFirst({
				where: { nome: nac.nome },
			});

			const filial = await this.prisma.filial.findFirst({
				where: { nome: nac.filial },
			});

			if (!nacExists && filial) {
				await this.prisma.departamento.create({
					data: {
						nome: nac.nome,
						empresa_id: empresa_id,
						filial_id: 1,
						nac: true,
					},
				});
			}
		}
	}

	async importTipoContratos(
		tipoContratos: Prisma.TipoContratoCondominioUncheckedCreateInput[],
	) {
		for await (const tipoContrato of tipoContratos) {
			const tipoContratoExists =
				await this.prisma.tipoContratoCondominio.findFirst({
					where: { nome: tipoContrato.nome },
				});
			if (!tipoContratoExists) {
				await this.prisma.tipoContratoCondominio.create({
					data: { nome: tipoContrato.nome },
				});
			}
		}
	}

	async importCargos(
		cargos: Prisma.TipoContratoCondominioUncheckedCreateInput[],
	) {
		for await (const cargo of cargos) {
			const cargoExists = await this.prisma.cargo.findFirst({
				where: { nome: cargo.nome },
			});
			if (!cargoExists) {
				await this.prisma.cargo.create({
					data: { nome: cargo.nome },
				});
			}
		}
	}
}
