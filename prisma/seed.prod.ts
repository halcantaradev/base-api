import { Pessoa, PrismaClient, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();
const salt = bcrypt.genSaltSync(10);
import { permissionslist } from '../src/modules/public/permissions/permissions-list';

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

async function main() {
	await createPermissoesList();
	const empresa = await createEmpresa();
	const user = await createUser(empresa);
	await cretePermissionToUser(user.id, empresa.id);

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
