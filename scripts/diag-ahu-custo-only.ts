/**
 * Isola efeito de custo (qtd_db × (custo_db − AG)) em 2026-10.
 * npx tsx --env-file=.env.prod-backup scripts/diag-ahu-custo-only.ts
 */
import { createRequire } from 'module';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaClient } from '@prisma/client';
import { parseSaldoDaAba } from '../src/lib/nfe/importar-saldo-parse';
import { matchNomeProdutoLista } from '../src/lib/nfe/match-nome-produto';
import { normalizarDescricao } from '../src/lib/nfe/normalize';

const require = createRequire(import.meta.url);
const XLSX = require('xlsx') as typeof import('xlsx');
const prisma = new PrismaClient();
const OWNER = 'cmk5ykusf0001jz04iwmf8xa8';

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

async function runStore(slug: string, file: string) {
  const wb = XLSX.readFile(file);
  const sheet =
    wb.SheetNames.find((s) => s.trim().toUpperCase() === 'OUTUBRO') ??
    wb.SheetNames.find((s) => s.toUpperCase().includes('OUTUBRO'))!;
  const plan = parseSaldoDaAba(wb.Sheets[sheet]);

  const configs = await prisma.cmvRealInsumoConfig.findMany({
    where: { userId: OWNER, ativo: true },
    include: { estoqueInsumo: { select: { nome: true } } },
  });
  const catalogo = configs.map((c) => ({
    id: c.estoqueInsumoId,
    nome: c.estoqueInsumo.nome,
    nomeNormalizado: normalizarDescricao(c.estoqueInsumo.nome),
    secao: c.secao,
  }));
  const saldos = await prisma.cmvSaldoEstoque.findMany({
    where: { userId: OWNER, storeSlug: slug, competencia: '2026-10' },
  });
  const saldoById = new Map(saldos.map((s) => [s.estoqueInsumoId, s]));

  const bySec: Record<string, { n: number; efeitoCusto: number; planilhaN: number }> = {};
  const used = new Set<string>();

  for (const pl of plan) {
    if (!(pl.qtdFinal > 0) && !(pl.valorFinal > 0)) continue;
    if (pl.custoPlanilha == null || !(pl.custoPlanilha > 0)) continue;
    const match = matchNomeProdutoLista(pl.nome, catalogo);
    if (!match.item || match.item.secao !== pl.secao) continue;
    if (used.has(match.item.id)) continue;
    used.add(match.item.id);
    const s = saldoById.get(match.item.id);
    if (!s || !(n(s.qtdFinal) > 0)) continue;
    if (!bySec[pl.secao]) bySec[pl.secao] = { n: 0, efeitoCusto: 0, planilhaN: 0 };
    if (s.custoOrigem === 'PLANILHA' || s.custoOrigem === 'MANUAL') {
      bySec[pl.secao].planilhaN += 1;
      continue;
    }
    const custoDb = s.custoMedio != null ? n(s.custoMedio) : null;
    if (custoDb == null) continue;
    if (Math.abs(custoDb - pl.custoPlanilha) < 0.001) continue;
    const efeito = round2(n(s.qtdFinal) * (custoDb - pl.custoPlanilha));
    bySec[pl.secao].n += 1;
    bySec[pl.secao].efeitoCusto += efeito;
  }

  console.log(`\n=== ${slug} ===`);
  console.log(`saldos=${saldos.length} planilha=${file}`);
  let tot = 0;
  let nItens = 0;
  for (const sec of ['MATERIA_PRIMA', 'EMBALAGEM', 'BEBIDA']) {
    const a = bySec[sec];
    if (!a) {
      console.log(`  ${sec}: sem overlay`);
      continue;
    }
    a.efeitoCusto = round2(a.efeitoCusto);
    tot += a.efeitoCusto;
    nItens += a.n;
    console.log(
      `  ${sec}: itens com custo≠AG e origem≠PLANILHA/MANUAL: ${a.n} | efeito qtd×Δcusto=${fmt(a.efeitoCusto)} | ainda PLANILHA/MANUAL casados=${a.planilhaN}`,
    );
  }
  console.log(`  TOTAL efeito custo sobrescrito: ${fmt(round2(tot))} (${nItens} itens)`);
}

async function main() {
  await runStore(
    'ahu',
    'D:/mods/mds sa/mods the sims/CMV_DESPERDÍCIO - AHU 2025_2026.xlsx',
  );
  // pilar/portao: sem saldo out
  for (const slug of ['pilarzinho', 'portao'] as const) {
    const c = await prisma.cmvSaldoEstoque.count({
      where: { userId: OWNER, storeSlug: slug, competencia: '2026-10' },
    });
    console.log(`\n=== ${slug} ===`);
    console.log(`saldos out= ${c} → sem estoque final importado (zerado em 25/11). Não há custo PLANILHA sobrescrito a corrigir agora.`);
  }
  await runStore(
    'uberaba',
    'D:/mods/mds sa/mods the sims/CMV_DESPERDÍCIO - UBERABA 2026.xlsx',
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
