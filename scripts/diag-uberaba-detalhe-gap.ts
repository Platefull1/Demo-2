/**
 * Detalhe dos gaps MP/BEB Uberaba — somente leitura (prod).
 * npx tsx --env-file=.env.prod-backup scripts/diag-uberaba-detalhe-gap.ts
 */
import { createRequire } from 'module';
import { PrismaClient } from '@prisma/client';
import { parseSaldoDaAba } from '../src/lib/nfe/importar-saldo-parse';
import { matchNomeProdutoLista } from '../src/lib/nfe/match-nome-produto';
import { normalizarDescricao } from '../src/lib/nfe/normalize';
import * as fs from 'fs';
import * as path from 'path';

const require = createRequire(import.meta.url);
const XLSX = require('xlsx') as typeof import('xlsx');
const prisma = new PrismaClient();
const OWNER = 'cmk5ykusf0001jz04iwmf8xa8';
const STORE = 'uberaba';

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
  const dir = 'D:/mods/mds sa/mods the sims';
  const file = fs
    .readdirSync(dir)
    .find((f) => f.toLowerCase().includes('uberaba') && f.endsWith('.xlsx'))!;
  const wb = XLSX.readFile(path.join(dir, file));
  const sheet = wb.SheetNames.find((s) => s.trim().toUpperCase() === 'OUTUBRO')!;
  const plan = parseSaldoDaAba(wb.Sheets[sheet]);

  const configs = await prisma.cmvRealInsumoConfig.findMany({
    where: { userId: OWNER, ativo: true },
    include: { estoqueInsumo: { select: { id: true, nome: true } } },
  });
  const cfgById = new Map(configs.map((c) => [c.estoqueInsumoId, c]));
  const catalogo = configs.map((c) => ({
    id: c.estoqueInsumoId,
    nome: c.estoqueInsumo.nome,
    nomeNormalizado: normalizarDescricao(c.estoqueInsumo.nome),
    secao: c.secao,
  }));

  const saldos = await prisma.cmvSaldoEstoque.findMany({
    where: { userId: OWNER, storeSlug: STORE, competencia: '2026-10' },
  });
  const saldoById = new Map(saldos.map((s) => [s.estoqueInsumoId, s]));

  // Names for orphans
  const orphanIds = saldos.filter((s) => !cfgById.has(s.estoqueInsumoId)).map((s) => s.estoqueInsumoId);
  const orphanInsumos = await prisma.estoqueInsumo.findMany({
    where: { id: { in: orphanIds } },
    select: { id: true, nome: true },
  });
  const orphanNome = new Map(orphanInsumos.map((i) => [i.id, i.nome]));

  console.log('=== Órfãos no saldo out com nome suspeito (KIT KAT / DESFIADA / KUAT / SPRITE) ===');
  for (const s of saldos) {
    const nome = cfgById.get(s.estoqueInsumoId)?.estoqueInsumo.nome ?? orphanNome.get(s.estoqueInsumoId) ?? s.estoqueInsumoId;
    const up = nome.toUpperCase();
    if (
      up.includes('KIT KAT') ||
      up.includes('DESFIAD') ||
      up.includes('KUAT') ||
      up.includes('SPRITE') ||
      up.includes('PISTACHE') ||
      up.includes('MORANGO')
    ) {
      const cfg = cfgById.get(s.estoqueInsumoId);
      console.log(
        `  [${cfg?.secao ?? 'ORFAO'}] ${nome} qtd=${n(s.qtdFinal)} custo=${s.custoMedio} origem=${s.custoOrigem} valor=${fmt(round2(n(s.qtdFinal) * n(s.custoMedio)))} id=${s.estoqueInsumoId.slice(-8)}`,
      );
    }
  }

  console.log('\n=== Planilha: mesmos nomes ===');
  for (const p of plan) {
    const up = p.nome.toUpperCase();
    if (
      up.includes('KIT KAT') ||
      up.includes('DESFIAD') ||
      up.includes('KUAT') ||
      up.includes('SPRITE') ||
      up.includes('PISTACHE') ||
      up.includes('MORANGO')
    ) {
      const m = matchNomeProdutoLista(p.nome, catalogo);
      console.log(
        `  [${p.secao}] ${p.nome} AH=${fmt(p.valorFinal)} qtd=${p.qtdFinal} match=${m.status} → ${m.item?.nome ?? '-'} (${m.item?.secao ?? ''})`,
      );
    }
  }

  // Quantos saldos ativos têm origem PLANILHA vs recalculado
  console.log('\n=== Breakdown origem × seção (ativos, valor>0) ===');
  const br: Record<string, Record<string, number>> = {};
  for (const s of saldos) {
    const cfg = cfgById.get(s.estoqueInsumoId);
    if (!cfg) continue;
    const valor = round2(n(s.qtdFinal) * n(s.custoMedio));
    if (valor === 0 && n(s.qtdFinal) === 0) continue;
    const o = s.custoOrigem ?? 'NULL';
    if (!br[cfg.secao]) br[cfg.secao] = {};
    br[cfg.secao][o] = round2((br[cfg.secao][o] ?? 0) + valor);
  }
  for (const [sec, os] of Object.entries(br)) {
    console.log(sec);
    for (const [o, v] of Object.entries(os).sort()) console.log(`  ${o}: ${fmt(v)}`);
  }

  // Reconstruct MP gap components cleanly
  console.log('\n=== Componentes do gap MP (plan − card = 253,52) ===');
  let unmatched = 0;
  let costGap = 0;
  for (const p of plan.filter((x) => x.secao === 'MATERIA_PRIMA' && (x.valorFinal || x.qtdFinal))) {
    const m = matchNomeProdutoLista(p.nome, catalogo);
    if (!m.item || m.item.secao !== 'MATERIA_PRIMA') {
      unmatched += p.valorFinal;
      console.log(`  UNMATCH −${fmt(p.valorFinal)} ${p.nome}`);
      continue;
    }
    const s = saldoById.get(m.item.id);
    const dbVal = s ? round2(n(s.qtdFinal) * n(s.custoMedio)) : 0;
    const d = round2(dbVal - p.valorFinal);
    if (Math.abs(d) > 0.01) {
      costGap += d;
      console.log(
        `  CUSTO ${d >= 0 ? '+' : ''}${fmt(d)} ${p.nome} plan=${fmt(p.valorFinal)} db=${fmt(dbVal)} origem=${s?.custoOrigem}`,
      );
    }
  }
  // DB-only MP
  const matchedIds = new Set<string>();
  for (const p of plan.filter((x) => x.secao === 'MATERIA_PRIMA')) {
    const m = matchNomeProdutoLista(p.nome, catalogo);
    if (m.item) matchedIds.add(m.item.id);
  }
  let dbOnly = 0;
  for (const s of saldos) {
    const cfg = cfgById.get(s.estoqueInsumoId);
    if (!cfg || cfg.secao !== 'MATERIA_PRIMA') continue;
    if (matchedIds.has(s.estoqueInsumoId)) continue;
    const v = round2(n(s.qtdFinal) * n(s.custoMedio));
    if (v === 0) continue;
    dbOnly += v;
    console.log(`  DB-ONLY +${fmt(v)} ${cfg.estoqueInsumo.nome}`);
  }
  unmatched = round2(unmatched);
  costGap = round2(costGap);
  dbOnly = round2(dbOnly);
  console.log(`\nSoma unmatched (sai do card): ${fmt(unmatched)}`);
  console.log(`Soma costGap (db−plan nos casados): ${fmt(costGap)}`);
  console.log(`Soma dbOnly: ${fmt(dbOnly)}`);
  console.log(
    `card = plan − unmatched + costGap + dbOnly = ${fmt(31965.41 - unmatched + costGap + dbOnly)}`,
  );
  console.log(`plan − card = ${fmt(unmatched - costGap - dbOnly)} (esperado 253,52)`);

  console.log('\n=== Componentes do gap BEB (card − plan = 325,24) ===');
  unmatched = 0;
  costGap = 0;
  dbOnly = 0;
  matchedIds.clear();
  for (const p of plan.filter((x) => x.secao === 'BEBIDA' && (x.valorFinal || x.qtdFinal))) {
    const m = matchNomeProdutoLista(p.nome, catalogo);
    if (!m.item || m.item.secao !== 'BEBIDA') {
      unmatched += p.valorFinal;
      console.log(`  UNMATCH −${fmt(p.valorFinal)} ${p.nome}`);
      continue;
    }
    matchedIds.add(m.item.id);
    const s = saldoById.get(m.item.id);
    const dbVal = s ? round2(n(s.qtdFinal) * n(s.custoMedio)) : 0;
    const d = round2(dbVal - p.valorFinal);
    if (Math.abs(d) > 0.01) {
      costGap += d;
      console.log(
        `  CUSTO ${d >= 0 ? '+' : ''}${fmt(d)} ${p.nome} → ${m.item.nome} plan=${fmt(p.valorFinal)} db=${fmt(dbVal)} origem=${s?.custoOrigem}`,
      );
    }
  }
  for (const s of saldos) {
    const cfg = cfgById.get(s.estoqueInsumoId);
    if (!cfg || cfg.secao !== 'BEBIDA') continue;
    if (matchedIds.has(s.estoqueInsumoId)) continue;
    const v = round2(n(s.qtdFinal) * n(s.custoMedio));
    if (Math.abs(v) < 0.01) continue;
    dbOnly += v;
    console.log(`  DB-ONLY +${fmt(v)} ${cfg.estoqueInsumo.nome} origem=${s.custoOrigem}`);
  }
  unmatched = round2(unmatched);
  costGap = round2(costGap);
  dbOnly = round2(dbOnly);
  console.log(`\nSoma unmatched: ${fmt(unmatched)}`);
  console.log(`Soma costGap: ${fmt(costGap)}`);
  console.log(`Soma dbOnly: ${fmt(dbOnly)}`);
  console.log(
    `card = plan − unmatched + costGap + dbOnly = ${fmt(8356.6 - unmatched + costGap + dbOnly)}`,
  );
  console.log(`card − plan = ${fmt(-unmatched + costGap + dbOnly)} (esperado 325,24)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
