/**
 * Bebida em notas IGNORADAS de setembro (só leitura).
 */
import { PrismaClient } from '@prisma/client';

const OWNER = 'cmk5ykusf0001jz04iwmf8xa8';
const prisma = new PrismaClient();

async function main() {
  const cfgs = await prisma.cmvRealInsumoConfig.findMany({
    where: { userId: OWNER },
    select: { estoqueInsumoId: true, secao: true },
  });
  const secao = new Map(cfgs.map((c) => [c.estoqueInsumoId, c.secao]));
  const itens = await prisma.nfeItem.findMany({
    where: { nota: { userId: OWNER, competencia: '2026-09', status: 'IGNORADA' } },
    include: { nota: { select: { storeSlug: true, numero: true } } },
  });
  const acc: Record<string, { n: number; bebida: number; total: number }> = {};
  for (const it of itens) {
    const loja = it.nota.storeSlug;
    acc[loja] ??= { n: 0, bebida: 0, total: 0 };
    acc[loja].n += 1;
    const v = Number(it.valorLiquido ?? it.valorBruto ?? 0);
    acc[loja].total += v;
    if (it.estoqueInsumoId && secao.get(it.estoqueInsumoId) === 'BEBIDA') {
      acc[loja].bebida += v;
    }
  }
  console.log(JSON.stringify({ itens: itens.length, acc }, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
