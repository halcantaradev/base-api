import { Pessoa, PrismaClient, Unidade } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();
const salt = bcrypt.genSaltSync(10);
import { permissionslist } from '../src/modules/public/permissions/permissions-list';
import { menulist } from '../src/modules/public/menu/menus-list';

async function createEmpresa() {
	let tipoEmpresa = await prisma.tiposPessoa.findUnique({
		where: { nome: 'empresa' },
	});

	let empresa = await prisma.pessoa.findUnique({
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

		return user;
		console.log('Usuário criado');
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

	let condominio = await prisma.pessoa.findUnique({
		where: { nome: 'Condominio' },
	});

	if (!tipoCondominio && !condominio) {
		tipoCondominio = await prisma.tiposPessoa.create({
			data: { nome: 'condominio', descricao: 'Condomínio' },
		});

		condominio = await prisma.pessoa.create({
			data: {
				nome: 'Condominio',
				cnpj: '999999999999',
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

	return condominio;
}

async function createContato(condominio: Pessoa) {
	const contatos = await prisma.contato.findFirst({
		where: { pessoa_id: condominio.id },
	});

	if (!contatos) {
		await prisma.contato.create({
			data: {
				descricao: 'Síndico',
				contato: 'exemplo@gmail.com',
				pessoa_id: condominio.id,
			},
		});
	}
}

async function createUnidade(condominio: Pessoa) {
	let unidade = await prisma.unidade.findUnique({
		where: {
			codigo: '001',
		},
	});

	if (!unidade) {
		unidade = await prisma.unidade.create({
			data: {
				codigo: '001',
				condominio_id: condominio.id,
			},
		});
	}

	return unidade;
}

async function createCondominos(unidade: Unidade) {
	let proprietario = await prisma.pessoa.findUnique({
		where: { nome: 'Francisco' },
	});

	let tipoProrietario = await prisma.tiposPessoa.findUnique({
		where: { nome: 'proprietario' },
	});

	if (!tipoProrietario) {
		tipoProrietario = await prisma.tiposPessoa.create({
			data: { nome: 'proprietario', descricao: 'Proprietário' },
		});
	}

	if (!proprietario) {
		proprietario = await prisma.pessoa.create({
			data: {
				nome: 'Francisco',
				cnpj: '9999999999999',
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

	let inquilino = await prisma.pessoa.findUnique({
		where: { nome: 'Antônio' },
	});

	let tipoInquilino = await prisma.tiposPessoa.findUnique({
		where: { nome: 'inquilino' },
	});

	if (!tipoInquilino) {
		tipoInquilino = await prisma.tiposPessoa.create({
			data: { nome: 'inquilino', descricao: 'Inquilino' },
		});
	}

	if (!inquilino) {
		inquilino = await prisma.pessoa.create({
			data: {
				nome: 'Antônio',
				cnpj: '8888888888888',
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

async function createTipoInfracao() {
	let tipoInfracao = await prisma.tipoInfracao.findUnique({
		where: { descricao: 'Animais' },
	});

	if (!tipoInfracao) {
		tipoInfracao = await prisma.tipoInfracao.create({
			data: { descricao: 'Animais' },
		});
	}
}

async function createMenu() {
	for await (const menu of menulist) {
		let menuSaved = await prisma.menu.findFirst({
			where: { url: menu.url },
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

async function main() {
	const empresa = await createEmpresa();
	const user = await createUser(empresa);
	await createPermissoesList();
	await createPermissionToUser(user.id, empresa.id);

	const condominio = await createCondominio(empresa);
	await createContato(condominio);

	const unidade = await createUnidade(condominio);
	await createCondominos(unidade);
	await createTipoInfracao();

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
