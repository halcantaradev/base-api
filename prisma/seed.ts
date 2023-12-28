import { Pessoa, PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { menulist } from '../src/modules/public/menu/menus-list';
import { permissionslist } from '../src/modules/public/permissions/permissions-list';
import { SystemParamsList } from '../src/modules/system-params/system-params-list';
const prisma = new PrismaClient();
const salt = bcrypt.genSaltSync(10);

async function createTiposPessoas() {
	let tipoPessoa = await prisma.tiposPessoa.findUnique({
		where: { nome: 'proprietario' },
	});

	if (!tipoPessoa) {
		await prisma.tiposPessoa.create({
			data: { nome: 'proprietario', descricao: 'Proprietário' },
		});
	}

	tipoPessoa = await prisma.tiposPessoa.findUnique({
		where: { nome: 'inquilino' },
	});

	if (!tipoPessoa) {
		await prisma.tiposPessoa.create({
			data: { nome: 'inquilino', descricao: 'Inquilino' },
		});
	}

	tipoPessoa = await prisma.tiposPessoa.findUnique({
		where: { nome: 'empresa' },
	});

	if (!tipoPessoa) {
		await prisma.tiposPessoa.create({
			data: { nome: 'empresa', descricao: 'Empresa' },
		});
	}

	tipoPessoa = await prisma.tiposPessoa.findUnique({
		where: { nome: 'condominio' },
	});

	if (!tipoPessoa) {
		await prisma.tiposPessoa.create({
			data: { nome: 'condominio', descricao: 'Condomínio' },
		});
	}

	console.log('Tipos de pessoas criados!');
}

async function createEmpresa() {
	const tipoEmpresa = await prisma.tiposPessoa.findUnique({
		where: { nome: 'empresa' },
	});

	const tipoHasEmpresa = await prisma.pessoasHasTipos.findFirst({
		where: { tipo_id: tipoEmpresa.id },
	});

	let empresa: any = null;
	if (!tipoHasEmpresa) {
		empresa = await prisma.pessoa.create({
			data: {
				nome: 'Empresa Teste',
				cnpj: '82.186.418/0001-08',
				endereco: 'Rua A',
				numero: '2541',
				bairro: 'Aldeota',
				cep: '60521-052',
				cidade: 'Fortaleza',
				uf: 'CE',
			},
		});

		await prisma.pessoasHasTipos.create({
			data: {
				pessoa_id: empresa.id,
				tipo_id: tipoEmpresa.id,
			},
		});

		console.log('Empresa criada!');
	} else {
		empresa = await prisma.pessoa.findUnique({
			where: { id: tipoHasEmpresa.pessoa_id },
		});
		console.log('Empresa já criada!');
	}

	return empresa;
}

async function createUser(empresa: Pessoa) {
	const useExist = await prisma.usuario.findUnique({
		where: { username: 'admin' },
	});

	const cargoExist = await prisma.cargo.findFirst({
		where: { nome: 'Admin' },
	});

	if (!useExist && !cargoExist) {
		const user = await prisma.usuario.create({
			data: {
				nome: 'Admin',
				username: 'admin',
				email: 'admin@admin.com',
				acessa_todos_departamentos: true,
				password: bcrypt.hashSync('123456', salt),
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
		} else {
			await prisma.permissoes.update({
				data: permission,
				where: { id: p.id },
			});
		}
	}
	console.log('Permissões criadas ou atualizadas!');
}

async function cretePermissionToUser(usuario_id: number, empresa_id: number) {
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

async function createMenu() {
	// await prisma.menu.deleteMany({});

	for await (const menu of menulist) {
		let menuSaved = await prisma.menu.findUnique({
			where: { id: menu.id_relation },
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
					id: menu.id_relation,
					permissao_id: permission?.id,
					label: menu.label,
					url: menu.url,
					icon: menu.icon,
					target: menu.target,
					ativo: menu.ativo != undefined ? menu.ativo : true,
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

							const menuExists = await prisma.menu.findUnique({
								where: { id: item.id_relation },
							});

							if (!menuExists)
								return prisma.menu.create({
									data: {
										id: item.id_relation,
										menu_id: menuSaved.id,
										permissao_id: permission?.id,
										label: item.label,
										url: item.url,
										icon: item.icon,
										target: item.target,
										ativo: item.ativo,
									},
								});

							return null;
						}

						return null;
					}),
			);
		}
	}
	console.log('Menus gerados com sucesso!');
}

async function createSystemParams(empresa_id: number) {
	await Promise.all(
		SystemParamsList.map((param) =>
			prisma.parametroSistema.upsert({
				create: { ...param, empresa_id },
				update: {
					...param,
					empresa_id,
					valor: undefined,
					ativo: undefined,
				},
				where: { chave: param.chave },
			}),
		),
	);

	console.log('Parâmetros do sistema atualizados com sucesso!');
}

async function main() {
	await createTiposPessoas();
	await createPermissoesList();
	const empresa = await createEmpresa();
	const user = await createUser(empresa);
	await cretePermissionToUser(user.id, empresa.id);
	await createMenu();
	await createSystemParams(empresa.id);
	console.log('Seeds de produção executadas');
}

main()
	.catch((e) => {
		console.log(e);
		process.exit(1);
	})
	.finally(async () => {
		prisma.$disconnect();
	});
