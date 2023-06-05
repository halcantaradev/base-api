import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();
const salt = bcrypt.genSaltSync(10);

async function main() {
  let tipoEmpresa = await prisma.tiposPessoa.findUnique({
    where: { nome: 'empresa' },
  });

  let empresa = await prisma.pessoa.findUnique({ where: { nome: 'Gestart' } });

  if (tipoEmpresa && !empresa) {
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
  }
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
