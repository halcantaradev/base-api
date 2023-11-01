import {
	Filial,
	Pessoa,
	PrismaClient,
	Taxa,
	TiposPessoa,
	Unidade,
} from '@prisma/client';
import { Contact } from '../src/shared/consts/contact.const';
import { ContactType } from '../src/shared/consts/contact-type.const';

const prisma = new PrismaClient();

async function findEmpresa(): Promise<Pessoa> {
	const empresa = await prisma.pessoa.findFirst({
		where: {
			tipos: {
				some: {
					tipo: {
						nome: 'empresa',
					},
				},
			},
		},
	});

	return empresa;
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

	if (!tipoCondominio) {
		tipoCondominio = await prisma.tiposPessoa.create({
			data: { nome: 'condominio', descricao: 'Condomínio' },
		});
	}

	if (!condominio) {
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

async function createContato(
	referencia_id: number,
	origem: Contact,
	tipo: ContactType,
	descricao: string,
) {
	const contatos = await prisma.contato.findFirst({
		where: { referencia_id: referencia_id, origem },
	});

	if (!contatos) {
		await prisma.contato.create({
			data: {
				descricao,
				contato:
					(tipo == ContactType.EMAIL &&
						`exemplo${referencia_id}-${origem}@gmail.com`) ||
					(tipo == ContactType.TELEFONE && `8540028922`) ||
					'',
				referencia_id,
				origem,
				tipo,
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

async function createAdmCondominio(condominio: Pessoa) {
	let sindico = await prisma.condomimioAdministracao.findFirst({
		where: { nome: `Síndico do condominio ${condominio.id}` },
	});

	if (!sindico) {
		const cargo = await createCargoAdmCondominio('Síndico');

		sindico = await prisma.condomimioAdministracao.create({
			data: {
				nome: `Síndico do condominio ${condominio.id}`,
				condominio_id: condominio.id,
				cargo_id: cargo.id,
			},
		});
	}

	await createContato(
		sindico.id,
		Contact.ADMINISTRACAO_CONDOMINIO,
		ContactType.EMAIL,
		'Síndico',
	);

	await createContato(
		sindico.id,
		Contact.ADMINISTRACAO_CONDOMINIO,
		ContactType.TELEFONE,
		'Síndico',
	);

	let gerente = await prisma.condomimioAdministracao.findFirst({
		where: { nome: `Gerente do condominio ${condominio.id}` },
	});

	if (!gerente) {
		const cargo = await createCargoAdmCondominio('Gerente');

		gerente = await prisma.condomimioAdministracao.create({
			data: {
				nome: `Gerente do condominio ${condominio.id}`,
				condominio_id: condominio.id,
				cargo_id: cargo.id,
			},
		});
	}

	await createContato(
		gerente.id,
		Contact.ADMINISTRACAO_CONDOMINIO,
		ContactType.EMAIL,
		'Gerente',
	);

	await createContato(
		sindico.id,
		Contact.ADMINISTRACAO_CONDOMINIO,
		ContactType.TELEFONE,
		'Gerente',
	);
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

	await createContato(
		proprietario.id,
		Contact.PESSOA,
		ContactType.EMAIL,
		'Proprietário',
	);

	await createContato(
		proprietario.id,
		Contact.PESSOA,
		ContactType.TELEFONE,
		'Proprietário',
	);

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

	await createContato(
		inquilino.id,
		Contact.PESSOA,
		ContactType.EMAIL,
		'Inquilino',
	);

	await createContato(
		inquilino.id,
		Contact.PESSOA,
		ContactType.TELEFONE,
		'Inquilino',
	);
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

async function createCargoAdmCondominio(cargo: string) {
	let sindico = await prisma.cargosCondominio.findFirst({
		where: {
			nome: cargo,
		},
	});

	if (!sindico) {
		sindico = await prisma.cargosCondominio.create({
			data: {
				nome: cargo,
			},
		});
	}

	return sindico;
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

async function createFilial(empresa: Pessoa) {
	let filial = await prisma.filial.findFirst({
		where: {
			nome: 'Filial de Teste',
		},
	});

	if (!filial)
		filial = await prisma.filial.create({
			data: {
				nome: 'Filial de Teste',
				empresa_id: empresa.id,
			},
		});

	return filial;
}

async function createDepartamento(empresa: Pessoa, filial: Filial) {
	const departamento = await prisma.departamento.findFirst({
		where: {
			nome: 'Departamento de Teste',
		},
	});

	if (!departamento)
		await prisma.departamento.create({
			data: {
				nome: 'Departamento de Teste',
				empresa_id: empresa.id,
				nac: false,
				externo: false,
				filial_id: filial.id,
			},
		});
}

async function main() {
	const empresa = await findEmpresa();

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

	const tipos = await createTipoCondomino();
	const taxa = await createTaxa();

	await Promise.all([
		condominios.map(async (condominio) => {
			await createContato(
				condominio.id,
				Contact.PESSOA,
				ContactType.EMAIL,
				'Condomínio',
			);

			await createAdmCondominio(condominio);

			const unidade = await createUnidade(condominio);

			await createCondominos(
				unidade,
				tipos.tipoProrietario,
				tipos.tipoInquilino,
			);

			await createTaxaUnidade(taxa, unidade);
		}),
	]);

	const filial = await createFilial(empresa);
	await createDepartamento(empresa, filial);

	console.log('Seeds de desenvolvimento executadas');
}

main()
	.catch((e) => {
		console.log(e);
		process.exit(1);
	})
	.finally(async () => {
		prisma.$disconnect();
	});
