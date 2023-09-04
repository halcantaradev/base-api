import {
	Pessoa,
	PrismaClient,
	Taxa,
	TiposPessoa,
	Unidade,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();
const salt = bcrypt.genSaltSync(10);
import { permissionslist } from '../src/modules/public/permissions/permissions-list';
import { menulist } from '../src/modules/public/menu/menus-list';
import { Contact } from 'src/shared/consts/contact.const';

async function createEmpresa() {
	let tipoEmpresa = await prisma.tiposPessoa.findUnique({
		where: { nome: 'empresa' },
	});

	let empresa = await prisma.pessoa.findFirst({
		where: { nome: 'Gestart' },
	});

	if (!tipoEmpresa && !empresa) {
		tipoEmpresa = await prisma.tiposPessoa.create({
			data: { nome: 'empresa', descricao: 'Empresa' },
		});

		empresa = await prisma.pessoa.create({
			data: {
				nome: 'Gestart',
				cnpj: '88888888888',
			},
		});

		await prisma.pessoasHasTipos.create({
			data: {
				pessoa_id: empresa.id,
				tipo_id: tipoEmpresa.id,
			},
		});
	}

	return empresa;
}

async function createUser(empresa: Pessoa) {
	const useExist = await prisma.user.findUnique({
		where: { username: 'admin' },
	});

	const cargoExist = await prisma.cargo.findFirst({
		where: { nome: 'Admin' },
	});

	if (!useExist && !cargoExist) {
		const user = await prisma.user.create({
			data: {
				nome: 'Admin',
				username: 'admin',
				email: 'admin@admin.com',
				password: bcrypt.hashSync('123456', salt),
				acessa_todos_departamentos: true,
			},
		});

		const cargo = await prisma.cargo.create({
			data: {
				nome: 'Admin',
			},
		});

		await prisma.empresasHasUsuarios.create({
			data: {
				usuario_id: user.id,
				empresa_id: empresa.id,
				cargo_id: cargo.id,
			},
		});

		console.log('Usuário criado');
		return user;
	} else {
		console.log('Usuário já cadastrado');
	}

	return useExist;
}

async function createPermissoesList() {
	for await (const permission of permissionslist) {
		const p = await prisma.permissoes.findFirst({
			where: { key: permission.key },
		});

		if (!p) {
			await prisma.permissoes.create({ data: permission });
		}
	}
}

async function createPermissionToUser(usuario_id: number, empresa_id: number) {
	await prisma.usuarioHasPermissoes.deleteMany({
		where: { usuario_id },
	});

	const permissoes = await prisma.permissoes.findMany({});

	await prisma.usuarioHasPermissoes.createMany({
		data: permissoes.map((permission) => ({
			usuario_id,
			empresa_id,
			permissao_id: permission.id,
		})),
	});

	console.log('Permissões consedidas ao usuário Admin');
}

async function createCondominio(empresa: Pessoa) {
	let tipoCondominio = await prisma.tiposPessoa.findUnique({
		where: { nome: 'condominio' },
	});

	let condominio = await prisma.pessoa.findFirst({
		where: {
			nome: {
				contains: 'Condominio',
				mode: 'insensitive',
			},
		},
	});

	if (!tipoCondominio && !condominio) {
		tipoCondominio = await prisma.tiposPessoa.create({
			data: { nome: 'condominio', descricao: 'Condomínio' },
		});

		for (let cont = 1; cont <= 3; cont++) {
			condominio = await prisma.pessoa.create({
				data: {
					nome: `Condominio ${cont}`,
					cnpj: `99999999999${cont}`,
					empresa_id: empresa.id,
				},
			});

			await prisma.pessoasHasTipos.create({
				data: {
					pessoa_id: condominio.id,
					tipo_id: tipoCondominio.id,
				},
			});

			await prisma.empresaHasPessoas.create({
				data: {
					empresa_id: empresa.id,
					pessoa_id: condominio.id,
				},
			});
		}
	}

	return condominio;
}

async function createContato(condominio: Pessoa) {
	const contatos = await prisma.contato.findFirst({
		where: { referencia_id: condominio.id },
	});

	if (!contatos) {
		await prisma.contato.create({
			data: {
				descricao: 'Síndico',
				contato: `exemplo${condominio.id}@gmail.com`,
				referencia_id: condominio.id,
				origem: Contact.PESSOA,
			},
		});
	}
}

async function createUnidade(condominio: Pessoa) {
	let unidade = await prisma.unidade.findFirst({
		where: {
			codigo: `00${condominio.id}`,
		},
	});

	if (!unidade) {
		unidade = await prisma.unidade.create({
			data: {
				codigo: `00${condominio.id}`,
				condominio_id: condominio.id,
			},
		});
	}

	return unidade;
}

async function createTipoCondomino() {
	let tipoProrietario = await prisma.tiposPessoa.findUnique({
		where: { nome: 'proprietario' },
	});

	if (!tipoProrietario) {
		tipoProrietario = await prisma.tiposPessoa.create({
			data: { nome: 'proprietario', descricao: 'Proprietário' },
		});
	}

	let tipoInquilino = await prisma.tiposPessoa.findUnique({
		where: { nome: 'inquilino' },
	});

	if (!tipoInquilino) {
		tipoInquilino = await prisma.tiposPessoa.create({
			data: { nome: 'inquilino', descricao: 'Inquilino' },
		});
	}

	return {
		tipoProrietario,
		tipoInquilino,
	};
}

async function createCondominos(
	unidade: Unidade,
	tipoProrietario: TiposPessoa,
	tipoInquilino: TiposPessoa,
) {
	let proprietario = await prisma.pessoa.findFirst({
		where: { nome: `Francisco do apartamento ${unidade.codigo}` },
	});

	if (!proprietario) {
		proprietario = await prisma.pessoa.create({
			data: {
				nome: `Francisco do apartamento ${unidade.codigo}`,
				cnpj: `8888888${unidade.codigo}`,
			},
		});

		await prisma.pessoasHasUnidades.create({
			data: {
				unidade_id: unidade.id,
				pessoa_tipo_id: tipoProrietario.id,
				pessoa_id: proprietario.id,
			},
		});
	}

	let inquilino = await prisma.pessoa.findFirst({
		where: { nome: `Antônio morador do apartamento ${unidade.codigo}` },
	});

	if (!inquilino) {
		inquilino = await prisma.pessoa.create({
			data: {
				nome: `Antônio morador do apartamento ${unidade.codigo}`,
				cnpj: `7777777${unidade.codigo}`,
			},
		});

		await prisma.pessoasHasUnidades.create({
			data: {
				unidade_id: unidade.id,
				pessoa_tipo_id: tipoInquilino.id,
				pessoa_id: inquilino.id,
			},
		});
	}
}

async function createTipoInfracao(empresa: Pessoa) {
	let tipoInfracao = await prisma.tipoInfracao.findFirst({
		where: { descricao: 'Animais' },
	});

	if (!tipoInfracao) {
		tipoInfracao = await prisma.tipoInfracao.create({
			data: {
				descricao: 'Animais',
				empresa_id: empresa.id,
				fundamentacao_legal: 'É errado, então não faça mais isso',
			},
		});
	}
}

async function createMenu() {
	for await (const menu of menulist) {
		let menuSaved = await prisma.menu.findFirst({
			where: { label: menu.label, url: menu.url },
		});

		if (!menuSaved) {
			const permission = menu.permission_key
				? await prisma.permissoes.findFirst({
						where: {
							key: menu.permission_key,
						},
				  })
				: null;

			menuSaved = await prisma.menu.create({
				data: {
					permissao_id: permission?.id,
					label: menu.label,
					url: menu.url,
					icon: menu.icon,
					target: menu.target,
				},
			});
		}

		if (
			menulist.findIndex((item) => menu.id_relation == item.relation) !=
			-1
		) {
			await Promise.all(
				menulist
					.filter((item) => item.relation == menu.id_relation)
					.map(async (item) => {
						const menuSavedNested = await prisma.menu.findFirst({
							where: { url: item.url },
						});

						if (!menuSavedNested) {
							const permission = item.permission_key
								? await prisma.permissoes.findFirst({
										where: {
											key: item.permission_key,
										},
								  })
								: null;

							return prisma.menu.create({
								data: {
									menu_id: menuSaved.id,
									permissao_id: permission?.id,
									label: item.label,
									url: item.url,
									icon: item.icon,
									target: item.target,
								},
							});
						}

						return null;
					}),
			);
		}
	}
}

async function createTaxa() {
	let taxa = await prisma.taxa.findUnique({
		where: {
			descricao: 'Taxa de Condomínio',
		},
	});

	if (!taxa) {
		taxa = await prisma.taxa.create({
			data: {
				descricao: 'Taxa de Condomínio',
			},
		});
	}

	return taxa;
}

async function createTaxaUnidade(taxa: Taxa, unidade: Unidade) {
	const taxaExists = await prisma.unidadeHasTaxas.findFirst({
		where: { unidade_id: unidade.id },
	});
	if (!taxaExists)
		await prisma.unidadeHasTaxas.create({
			data: {
				unidade_id: unidade.id,
				valor: 2500,
				taxa_id: taxa.id,
			},
		});
}

async function main() {
	const empresa = await createEmpresa();
	const user = await createUser(empresa);
	await createPermissoesList();
	await createPermissionToUser(user.id, empresa.id);

	await createCondominio(empresa);

	const condominios = await prisma.pessoa.findMany({
		where: {
			tipos: {
				some: {
					tipo: {
						nome: 'condominio',
					},
				},
			},
		},
	});

	await createTipoInfracao(empresa);
	const tipos = await createTipoCondomino();
	const taxa = await createTaxa();

	await Promise.all([
		condominios.map(async (condominio) => {
			await createContato(condominio);

			const unidade = await createUnidade(condominio);
			await createCondominos(
				unidade,
				tipos.tipoProrietario,
				tipos.tipoInquilino,
			);
			await createTaxaUnidade(taxa, unidade);
		}),
	]);

	await createMenu();

	console.log('Seeds executadas');
}

main()
	.catch((e) => {
		console.log(e);
		process.exit(1);
	})
	.finally(async () => {
		prisma.$disconnect();
	});
