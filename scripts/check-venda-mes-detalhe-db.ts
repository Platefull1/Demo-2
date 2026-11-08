/**
 * Lista CmvFechamento com vendaMesDetalhe e detecta regra antiga
 * (taxasAteLimiteDistintas / exclusão de taxa ≤ 6,99).
 *
 * npx tsx --env-file=.env scripts/check-venda-mes-detalhe-db.ts
 */
import { PrismaClient } from '@prisma/client';
import { parseVendaMesDetalhe } from '../src/lib/cmv-real/venda-liquida';

const prisma = new PrismaClient();

async function main() {
  const rows = await prisma.cmvFechamento.findMany({
    where: { vendaMesDetalhe: { not: null } },
    select: {
      id: true,
      storeSlug: true,
      competencia: true,
      status: true,
      vendaMes: true,
      vendaMesOrigem: true,
      vendaMesDetalhe: true,
    },
    orderBy: [{ competencia: 'desc' }, { storeSlug: 'asc' }],
  });

  console.log(`Fechamentos com vendaMesDetalhe: ${rows.length}`);
  if (rows.length === 0) {
    console.log('Nenhum registro — regra antiga não gravou no banco.');
    return;
  }

  for (const r of rows) {
    const raw = r.vendaMesDetalhe as Record<string, unknown> | null;
    const parsed = parseVendaMesDetalhe(r.vendaMesDetalhe);
    const temChaveAntiga = raw != null && 'taxasAteLimiteDistintas' in raw;
    const temChaveNova = raw != null && 'taxasAcimaLimiteDistintas' in raw;
    const taxasDistintas = temChaveAntiga
      ? (raw!.taxasAteLimiteDistintas as unknown[])
      : temChaveNova
        ? (raw!.taxasAcimaLimiteDistintas as unknown[])
        : [];
    const inclui699 =
      Array.isArray(taxasDistintas) &&
      taxasDistintas.some((x) => Math.abs(Number(x) - 6.99) < 1e-9);
    // Regra antiga excluía ≤6,99 → tipicamente inclui 6.99 nas distintas e taxa alta
    const regraAntigaProvavel = temChaveAntiga || inclui699;

    console.log(
      JSON.stringify(
        {
          storeSlug: r.storeSlug,
          competencia: r.competencia,
          status: r.status,
          vendaMes: r.vendaMes != null ? Number(r.vendaMes) : null,
          origem: r.vendaMesOrigem,
          taxaExcluida: parsed?.taxaEntregaExcluida ?? null,
          liquida: parsed?.vendaLiquida ?? null,
          temChaveAntiga,
          temChaveNova,
          inclui699nasDistintas: inclui699,
          regraAntigaProvavel,
          calculadoEm: parsed?.calculadoEm ?? null,
          temAjuste: !!parsed?.ajusteVenda,
        },
        null,
        2,
      ),
    );
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
