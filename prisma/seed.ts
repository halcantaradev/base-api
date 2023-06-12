import { Pessoa, PrismaClient, Unidade } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();
const salt = bcrypt.genSaltSync(10);

async function createEmpresa() {
  let tipoEmpresa = await prisma.tiposPessoa.findUnique({
    where: { nome: 'empresa' },
  });

  let empresa = await prisma.pessoa.findUnique({ where: { nome: 'Gestart' } });

  if (!tipoEmpresa && !empresa) {
    tipoEmpresa = await prisma.tiposPessoa.create({
      data: { nome: 'empresa' },
    });

    empresa = await prisma.pessoa.create({
      data: {
        nome: 'Gestart',
        cnpj: '88888888888',
      },
    });

    prisma.pessoasHasTipos.create({
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
  }
}

async function createCondominio() {
  let tipoCondominio = await prisma.tiposPessoa.findUnique({
    where: { nome: 'condominio' },
  });

  let condominio = await prisma.pessoa.findUnique({
    where: { nome: 'Condominio Teste' },
  });

  if (!tipoCondominio && !condominio) {
    tipoCondominio = await prisma.tiposPessoa.create({
      data: { nome: 'condominio' },
    });

    condominio = await prisma.pessoa.create({
      data: {
        nome: 'Condominio',
        cnpj: '999999999999',
      },
    });

    prisma.pessoasHasTipos.create({
      data: {
        pessoa_id: condominio.id,
        tipo_id: tipoCondominio.id,
      },
    });
  }

  return condominio;
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

async function createNotificacao(unidade: Unidade) {
  let tipoInfracao = await prisma.tipoInfracao.findUnique({
    where: { descricao: 'Animais' },
  });

  let notificacao = await prisma.notificacao.findFirst({
    where: {
      tipoInfracao: {
        descricao: 'Animais',
      },
    },
  });

  if (!tipoInfracao) {
    tipoInfracao = await prisma.tipoInfracao.create({
      data: { descricao: 'Animais' },
    });
  }

  if (!notificacao) {
    notificacao = await prisma.notificacao.create({
      data: {
        unidade_id: unidade.id,
        fundamentacao_legal: '',
        n_notificacao: '01/2023',
        detalhes_infracao: '',
        data_emissao: new Date(),
        data_infracao: new Date(),
        infracao_id: tipoInfracao.id,
      },
    });
  }
}

async function main() {
  const empresa = await createEmpresa();
  await createUser(empresa);

  const condominio = await createCondominio();
  const unidade = await createUnidade(condominio);

  await createNotificacao(unidade);

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
