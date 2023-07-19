import { Pessoa, PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { menulist } from '../src/modules/public/menu/menus-list';
import { permissionslist } from '../src/modules/public/permissions/permissions-list';
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

	let empresa = await prisma.pessoa.findUnique({
		where: { nome: 'Empresa Teste' },
	});

	if (!empresa) {
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
		console.log('Empresa já criada!');
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
	console.log('Menus gerados com sucesso!');
}

async function creatSetupSistena(empresa_id: number) {
	const setup = await prisma.sistemaSetup.findFirst();

	if (!setup) {
		await prisma.sistemaSetup.create({
			data: {
				salario_minimo_base: 1320,
				sancao: `Nos Termos da Lei nº 4.591/64 e Lei 10406/02, vimos notificá-lo da infração cometida, que de acordo com
					código civil, convenção e/ou regimento interno do seu condomínio, é de responsabilidade do proprietário
					acima identificado.`,
				texto_padrao_notificacao: `De acordo com determinação da Convenção e Regimento Interno, fica o(a) proprietário(a)
					notificado(a) da infração e aplicada a advertência escrita, ficando ainda notificado (a) de que será
					aplicada multa pecuniária no valor abaixo, sem prejuízo das ações cíveis de reparação de danos
					que lhe poderão ser propostas pelo condomínio.`,
				empresa_id,
			},
		});
	}
}

async function createTipoInfracao(empresa_id: number) {
	const tipo = await prisma.tipoInfracao.findFirst();

	if (!tipo) {
		await prisma.tipoInfracao.createMany({
			data: [
				{
					descricao: 'Animal',
					empresa_id,
				},
				{
					descricao: 'Barulho',
					empresa_id,
				},
				{
					descricao: 'Garagem',
					empresa_id,
				},
				{
					descricao: 'Vazamento',
					empresa_id,
				},
				{
					descricao: 'Alteração da fachada',
					empresa_id,
				},
			],
		});
	}
}

async function main() {
	await createTiposPessoas();
	await createPermissoesList();
	const empresa = await createEmpresa();
	const user = await createUser(empresa);
	await createTipoInfracao(empresa.id);
	await creatSetupSistena(empresa.id);
	await cretePermissionToUser(user.id, empresa.id);
	await createMenu();

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
