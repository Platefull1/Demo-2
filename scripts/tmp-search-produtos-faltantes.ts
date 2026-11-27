import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const OWNER = 'cmk5ykusf0001jz04iwmf8xa8';

async function main() {
  const terms = ['DESFIAD', 'KIT KAT', 'KITKAT', 'KUAT', 'CARNE BOV', 'BARRA'];
  for (const t of terms) {
    const rows = await prisma.estoqueInsumo.findMany({
      where: { nome: { contains: t, mode: 'insensitive' } },
      select: { id: true, userId: true, nome: true, insumoId: true },
      take: 40,
    });
    console.log(`\n=== ${t} n=${rows.length}`);
    for (const r of rows) {
      console.log(`  user=${r.userId.slice(-6)} | ${r.nome} | slug=${r.insumoId} | id=${r.id.slice(-8)}`);
    }
  }

  const cfgs = await prisma.cmvRealInsumoConfig.findMany({
    where: { userId: OWNER },
    include: { estoqueInsumo: { select: { nome: true } } },
  });
  console.log('\n=== configs CMV suspeitos ===');
  for (const c of cfgs) {
    const n = c.estoqueInsumo.nome.toUpperCase();
    if (
      n.includes('DESFIAD') ||
      n.includes('KIT') ||
      n.includes('KUAT') ||
      n.includes('BARRA') ||
      n.includes('CHOCOLATE')
    ) {
      console.log(`  ativo=${c.ativo} ${c.secao} ${c.estoqueInsumo.nome}`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
