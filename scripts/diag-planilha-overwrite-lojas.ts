/**
 * Read-only: diferença planilha AG vs custo atual em 2026-10
 * para ahu, pilarzinho, portao (uberaba = referência pós-correção).
 *
 * npx tsx --env-file=.env.prod-backup scripts/diag-planilha-overwrite-lojas.ts
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
const COMP = '2026-10';

const LOJAS: Array<{ slug: string; fileIncludes: string[] }> = [
  { slug: 'ahu', fileIncludes: ['AHU', 'DESPER'] },
  { slug: 'pilarzinho', fileIncludes: ['PILAR', 'DESPER'] },
  { slug: 'portao', fileIncludes: ['PORT', 'DESPER'] },
  { slug: 'uberaba', fileIncludes: ['UBERABA', 'DESPER'] },
];

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

function findFile(includes: string[]): string | null {
  const dirs = ['D:/mods/mds sa/mods the sims', 'D:/mods/mds sa'];
  const hits: Array<{ full: string; mtime: number }> = [];
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) {
      if (!f.toLowerCase().endsWith('.xlsx')) continue;
      const up = f.toUpperCase();
      if (!includes.every((x) => up.includes(x.toUpperCase()))) continue;
      // ignorar exports cmv-ahu-2026-10 etc.
      if (up.startsWith('CMV-')) continue;
      hits.push({
        full: path.join(dir, f),
        mtime: fs.statSync(path.join(dir, f)).mtimeMs,
      });
    }
  }
  if (!hits.length) return null;
  hits.sort((a, b) => b.mtime - a.mtime);
  return hits[0].full;
}

async function main() {
  console.log('Diagnóstico PLANILHA sobrescrito — 2026-10 (somente leitura)\n');

  const configs = await prisma.cmvRealInsumoConfig.findMany({
    where: { userId: OWNER, ativo: true },
    include: { estoqueInsumo: { select: { id: true, nome: true } } },
  });
  const catalogo = configs.map((c) => ({
    id: c.estoqueInsumoId,
    nome: c.estoqueInsumo.nome,
    nomeNormalizado: normalizarDescricao(c.estoqueInsumo.nome),
    secao: c.secao,
  }));
  const cfgById = new Map(configs.map((c) => [c.estoqueInsumoId, c]));

  for (const loja of LOJAS) {
    console.log('═'.repeat(72));
    console.log(` ${loja.slug}`);
    console.log('═'.repeat(72));

    const saldos = await prisma.cmvSaldoEstoque.findMany({
      where: { userId: OWNER, storeSlug: loja.slug, competencia: COMP },
    });
    console.log(`  Saldos out no banco: ${saldos.length}`);

    const orig: Record<string, { n: number; valor: number }> = {};
    let totalDbCatalogo = 0;
    for (const s of saldos) {
      const cfg = cfgById.get(s.estoqueInsumoId);
      if (!cfg) continue;
      const valor = round2(n(s.qtdFinal) * n(s.custoMedio));
      if (!(n(s.qtdFinal) > 0)) continue;
      const o = s.custoOrigem ?? 'NULL';
      if (!orig[o]) orig[o] = { n: 0, valor: 0 };
      orig[o].n += 1;
      orig[o].valor += valor;
      totalDbCatalogo += valor;
    }
    console.log(`  Valor catálogo ativo (qtd>0): ${fmt(round2(totalDbCatalogo))}`);
    console.log('  Origens:');
    if (!Object.keys(orig).length) {
      console.log('    (nenhum saldo ativo com qtd>0)');
    }
    for (const [o, a] of Object.entries(orig).sort()) {
      console.log(`    ${o.padEnd(22)} n=${String(a.n).padStart(3)} ${fmt(round2(a.valor))}`);
    }

    const file = findFile(loja.fileIncludes);
    if (!file) {
      console.log('  Planilha DESPERDÍCIO não encontrada\n');
      continue;
    }
    const wb = XLSX.readFile(file);
    const sheet =
      wb.SheetNames.find((s) => s.trim().toUpperCase() === 'OUTUBRO') ??
      wb.SheetNames.find((s) => s.toUpperCase().includes('OUTUBRO'));
    if (!sheet) {
      console.log(`  Sem aba OUTUBRO. Abas: ${wb.SheetNames.join(' | ')}\n`);
      continue;
    }
    console.log(`  Planilha: ${file}`);
    console.log(`  Aba: "${sheet}"`);

    const plan = parseSaldoDaAba(wb.Sheets[sheet]);
    const saldoById = new Map(saldos.map((s) => [s.estoqueInsumoId, s]));

    type SecAgg = {
      plan: number;
      db: number;
      diff: number;
      overwritten: number;
      overwrittenN: number;
      unmatchedPlan: number;
      unmatchedN: number;
      planilhaOkN: number;
    };
    const bySec: Record<string, SecAgg> = {};
    const ensure = (sec: string): SecAgg => {
      if (!bySec[sec]) {
        bySec[sec] = {
          plan: 0,
          db: 0,
          diff: 0,
          overwritten: 0,
          overwrittenN: 0,
          unmatchedPlan: 0,
          unmatchedN: 0,
          planilhaOkN: 0,
        };
      }
      return bySec[sec];
    };

    const used = new Set<string>();
    const topOver: Array<{ nome: string; secao: string; d: number; origem: string | null }> = [];

    for (const pl of plan) {
      if (!(pl.qtdFinal > 0) && !(pl.valorFinal > 0)) continue;
      const sec = ensure(pl.secao);
      sec.plan += pl.valorFinal || 0;

      const match = matchNomeProdutoLista(pl.nome, catalogo);
      if (!match.item || match.item.secao !== pl.secao) {
        sec.unmatchedPlan += pl.valorFinal || 0;
        sec.unmatchedN += 1;
        continue;
      }
      if (used.has(match.item.id)) continue;
      used.add(match.item.id);

      const s = saldoById.get(match.item.id);
      const custoAg = pl.custoPlanilha;
      const qtd = s ? n(s.qtdFinal) : 0;
      const custoDb = s?.custoMedio != null ? n(s.custoMedio) : null;
      const valorDb = round2(qtd * (custoDb ?? 0));
      sec.db += valorDb;
      const d = round2(valorDb - (pl.valorFinal || 0));
      sec.diff += d;

      if (!s) continue;
      if (
        s.custoOrigem === 'PLANILHA' &&
        custoAg != null &&
        custoDb != null &&
        Math.abs(custoDb - custoAg) < 0.001
      ) {
        sec.planilhaOkN += 1;
        continue;
      }
      if (
        s.custoOrigem !== 'PLANILHA' &&
        s.custoOrigem !== 'MANUAL' &&
        custoAg != null &&
        custoDb != null &&
        Math.abs(custoDb - custoAg) > 0.001
      ) {
        sec.overwrittenN += 1;
        sec.overwritten += d;
        topOver.push({
          nome: match.item.nome,
          secao: pl.secao,
          d,
          origem: s.custoOrigem,
        });
      }
    }

    console.log('\n  Por seção (planilha AH vs saldo catálogo casado):');
    let totalOver = 0;
    let totalDiff = 0;
    for (const sec of ['MATERIA_PRIMA', 'EMBALAGEM', 'BEBIDA']) {
      const a = bySec[sec];
      if (!a) continue;
      a.plan = round2(a.plan);
      a.db = round2(a.db);
      a.diff = round2(a.diff);
      a.overwritten = round2(a.overwritten);
      a.unmatchedPlan = round2(a.unmatchedPlan);
      totalOver += a.overwritten;
      totalDiff += a.diff;
      console.log(
        `    ${sec}: plan=${fmt(a.plan)} dbCasado=${fmt(a.db)} diff=${fmt(a.diff)} | overwrite(n=${a.overwrittenN} Δ=${fmt(a.overwritten)}) | unmatched(n=${a.unmatchedN} ${fmt(a.unmatchedPlan)}) | planilhaOk=${a.planilhaOkN}`,
      );
    }
    console.log(`\n  TOTAL diff casados (db−plan): ${fmt(round2(totalDiff))}`);
    console.log(
      `  TOTAL custo sobrescrito (origem≠PLANILHA/MANUAL e AG≠db): ${fmt(round2(totalOver))}`,
    );
    if (topOver.length) {
      console.log('  Top 10 overlays |diff|:');
      for (const t of topOver.sort((a, b) => Math.abs(b.d) - Math.abs(a.d)).slice(0, 10)) {
        console.log(`    [${t.secao}] ${t.nome}: ${fmt(t.d)} origem=${t.origem}`);
      }
    }
    console.log('');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
