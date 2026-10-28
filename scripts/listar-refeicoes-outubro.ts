import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const OWNER = 'cmk5ykusf0001jz04iwmf8xa8';

async function main() {
  for (const loja of ['portao', 'uberaba'] as const) {
    const f = await prisma.cmvFechamento.findUnique({
      where: {
        userId_storeSlug_competencia: {
          userId: OWNER,
          storeSlug: loja,
          competencia: '2026-10',
        },
      },
    });
    const refs = await prisma.cmvRefeicao.findMany({
      where: { userId: OWNER, storeSlug: loja, competencia: '2026-10' },
      orderBy: { data: 'asc' },
    });
    console.log(loja, {
      venda: f?.vendaMes != null ? Number(f.vendaMes) : null,
      origem: f?.vendaMesOrigem,
      n: refs.length,
      ignoradas: refs.filter((r) => r.ignorada).length,
    });
    for (const r of refs) {
      console.log(
        ' ',
        r.data.toISOString().slice(0, 10),
        r.categoria,
        Number(r.valorItens).toFixed(2),
        r.ignorada ? 'IGN' : '',
        r.consumidor || '',
      );
    }
  }
}
main().finally(() => prisma.$disconnect());
