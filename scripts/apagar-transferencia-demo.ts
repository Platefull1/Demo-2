import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const docs = await prisma.cmvTransferencia.findMany({
    where: { numeroDocumento: 'DEMO-ESPELHO' },
    include: { lados: { include: { itens: true } } },
  });
  const itemIds = docs.flatMap((d) => d.lados.flatMap((l) => l.itens.map((i) => i.id)));
  const lancs = itemIds.length
    ? await prisma.cmvLancamento.count({
        where: { transferenciaItemId: { in: itemIds } },
      })
    : 0;
  console.log('lancamentos', lancs);
  const r = await prisma.cmvTransferencia.updateMany({
    where: { numeroDocumento: 'DEMO-ESPELHO', excluidoEm: null },
    data: { excluidoEm: new Date() },
  });
  console.log('excluidos', r.count);
}

main().finally(() => prisma.$disconnect());
