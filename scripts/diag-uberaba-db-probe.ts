import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const OWNER = 'cmk5ykusf0001jz04iwmf8xa8';

async function main() {
  const url = process.env.DATABASE_URL || '';
  console.log('db host:', url.match(/@([^/?]+)/)?.[1] ?? '(none)');

  const totalSaldos = await prisma.cmvSaldoEstoque.count();
  console.log('total CmvSaldoEstoque rows:', totalSaldos);

  const byStore = await prisma.cmvSaldoEstoque.groupBy({
    by: ['storeSlug', 'competencia', 'userId'],
    where: { competencia: { in: ['2026-09', '2026-10', '2026-11'] } },
    _count: true,
  });
  console.log('saldos 09-11:');
  for (const r of byStore.sort((a, b) =>
    `${a.storeSlug}${a.competencia}`.localeCompare(`${b.storeSlug}${b.competencia}`),
  )) {
    console.log(
      `  ${r.storeSlug} ${r.competencia} user=${r.userId.slice(-6)} n=${r._count}`,
    );
  }

  const uber = await prisma.cmvSaldoEstoque.findMany({
    where: { storeSlug: { contains: 'uber', mode: 'insensitive' } },
    take: 5,
  });
  console.log('sample uber rows:', uber.length, uber[0] ?? null);

  const fech = await prisma.cmvFechamento.findMany({
    where: {
      competencia: { in: ['2026-10', '2026-11'] },
    },
    select: {
      storeSlug: true,
      competencia: true,
      status: true,
      userId: true,
      valoresManuais: true,
    },
  });
  console.log('fechamentos 10-11:', fech.length);
  for (const f of fech) {
    console.log(
      `  ${f.storeSlug} ${f.competencia} ${f.status} user=${f.userId.slice(-6)} manuais=${JSON.stringify(f.valoresManuais)}`,
    );
  }

  const ownerSaldos = await prisma.cmvSaldoEstoque.count({
    where: { userId: OWNER, storeSlug: 'uberaba' },
  });
  console.log('owner+uberaba saldos any month:', ownerSaldos);

  const lancUber = await prisma.cmvLancamento.groupBy({
    by: ['competencia'],
    where: { userId: OWNER, storeSlug: 'uberaba' },
    _count: true,
  });
  console.log('lancamentos uberaba:', lancUber);

  const notasUber = await prisma.nfeNota.groupBy({
    by: ['competencia', 'status'],
    where: { userId: OWNER, storeSlug: 'uberaba' },
    _count: true,
  });
  console.log('notas uberaba:', notasUber.slice(0, 20));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
