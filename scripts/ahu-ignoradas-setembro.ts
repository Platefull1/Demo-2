/**
 * Notas IGNORADAS de setembro do Ahú — valor e o que parece bebida.
 * npx tsx --env-file=.env scripts/ahu-ignoradas-setembro.ts
 */
import { PrismaClient } from '@prisma/client';

const OWNER = 'cmk5ykusf0001jz04iwmf8xa8';
const prisma = new PrismaClient();

async function main() {
  const notas = await prisma.nfeNota.findMany({
    where: { userId: OWNER, competencia: '2026-09', storeSlug: 'ahu' },
    select: {
      numero: true,
      status: true,
      valorTotal: true,
      fornecedor: { select: { nomeFantasia: true, razaoSocial: true } },
      itens: { select: { descricao: true, valorLiquido: true, valorBruto: true } },
    },
  });
  const porStatus: Record<string, { n: number; valor: number }> = {};
  for (const n of notas) {
    porStatus[n.status] ??= { n: 0, valor: 0 };
    porStatus[n.status].n += 1;
    porStatus[n.status].valor += Number(n.valorTotal ?? 0);
  }
  console.log('notas ahu set', { total: notas.length, porStatus });

  const ignoradas = notas.filter((n) => n.status === 'IGNORADA');
  console.log(
    'ignoradas',
    ignoradas.map((n) => ({
      nf: n.numero,
      valor: Number(n.valorTotal ?? 0),
      forn: n.fornecedor.nomeFantasia || n.fornecedor.razaoSocial,
      itens: n.itens.map((i) => ({
        d: i.descricao,
        v: Number(i.valorLiquido ?? i.valorBruto ?? 0),
      })),
    })),
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
