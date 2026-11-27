/**
 * Remove cmvEmbalagens do valoresManuais de uberaba/2026-11.
 * Confirma estoque inicial embalagens (= saldo out catálogo).
 *
 * npx tsx --env-file=.env.prod-backup scripts/tmp-clear-uberaba-emb-manual.ts [--execute]
 */
import { PrismaClient } from '@prisma/client';

const OWNER = 'cmk5ykusf0001jz04iwmf8xa8';
const STORE = 'uberaba';
const COMP = '2026-11';
const COMP_ANT = '2026-10';
const ALVO_EMB = 5_823.6;
const EXECUTE = process.argv.includes('--execute');

const prisma = new PrismaClient();

function n(v: unknown): number {
  if (v == null) return 0;
  return typeof v === 'number' ? v : Number(v);
}
function round2(v: number) {
  return Math.round(v * 100) / 100;
}
function fmt(v: number) {
  const neg = v < 0;
  const s = Math.abs(v).toFixed(2).replace('.', ',');
  const [i, d] = s.split(',');
  return `${neg ? '-' : ''}R$ ${i.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${d}`;
}

async function main() {
  const host = (process.env.DATABASE_URL || '').match(/@([^/?]+)/)?.[1] ?? '?';
  console.log(`DB: ${host}`);
  console.log(`Modo: ${EXECUTE ? 'EXECUTE' : 'DRY-RUN'}`);

  const fech = await prisma.cmvFechamento.findUnique({
    where: {
      userId_storeSlug_competencia: {
        userId: OWNER,
        storeSlug: STORE,
        competencia: COMP,
      },
    },
    select: { id: true, valoresManuais: true, status: true },
  });
  if (!fech) throw new Error('Fechamento uberaba/2026-11 não encontrado');

  const raw = (fech.valoresManuais ?? {}) as Record<string, unknown>;
  console.log('valoresManuais antes:', JSON.stringify(raw));

  const next: Record<string, unknown> = { ...raw };
  // remover override — null explícito ou delete; parseValoresManuais trata null
  next.cmvEmbalagens = null;

  console.log('valoresManuais depois:', JSON.stringify(next));

  if (EXECUTE) {
    await prisma.cmvFechamento.update({
      where: { id: fech.id },
      data: { valoresManuais: next },
    });
    const after = await prisma.cmvFechamento.findUnique({
      where: { id: fech.id },
      select: { valoresManuais: true },
    });
    console.log('gravado:', JSON.stringify(after?.valoresManuais));
  } else {
    console.log('(dry-run — não gravou)');
  }

  // Estoque inicial nov embalagens = saldo out catálogo ativo EMBALAGEM
  const configs = await prisma.cmvRealInsumoConfig.findMany({
    where: { userId: OWNER, ativo: true, secao: 'EMBALAGEM' },
    select: { estoqueInsumoId: true },
  });
  const ids = configs.map((c) => c.estoqueInsumoId);
  const saldos = await prisma.cmvSaldoEstoque.findMany({
    where: {
      userId: OWNER,
      storeSlug: STORE,
      competencia: COMP_ANT,
      estoqueInsumoId: { in: ids },
    },
  });
  const iniEmb = round2(
    saldos.reduce((a, s) => a + n(s.qtdFinal) * n(s.custoMedio), 0),
  );
  console.log(`\nEstoque inicial embalagens (saldo out catálogo): ${fmt(iniEmb)}`);
  console.log(`Alvo planilha: ${fmt(ALVO_EMB)}`);
  console.log(`Δ: ${fmt(round2(iniEmb - ALVO_EMB))}`);
  console.log(
    Math.abs(iniEmb - ALVO_EMB) < 0.02
      ? 'OK — bate com a planilha'
      : 'DIVERGE da planilha',
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
