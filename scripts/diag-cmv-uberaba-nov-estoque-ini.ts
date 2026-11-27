/**
 * Diagnóstico SOMENTE LEITURA — Uberaba nov/2026 vs saldo out/2026 + planilha
 *
 * NÃO chama montarFechamento (escreve custos via preencherCustosPendentesFechamento).
 *
 * Uso: npx tsx scripts/diag-cmv-uberaba-nov-estoque-ini.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { createRequire } from 'module';
import { PrismaClient } from '@prisma/client';
import {
  parseSaldoDaAba,
  type LinhaSaldoPlanilha,
} from '../src/lib/nfe/importar-saldo-parse';
import { matchNomeProdutoLista } from '../src/lib/nfe/match-nome-produto';
import { normalizarDescricao } from '../src/lib/nfe/normalize';

const require = createRequire(import.meta.url);
const XLSX = require('xlsx') as typeof import('xlsx');

const OWNER = 'cmk5ykusf0001jz04iwmf8xa8';
const STORE = 'uberaba';
const COMP = '2026-11';
const COMP_ANT = '2026-10';

const PLANILHA = {
  MATERIA_PRIMA: 31_965.41,
  BEBIDA: 8_356.6,
} as const;

const CARD = {
  MATERIA_PRIMA: 31_711.89,
  BEBIDA: 8_681.84,
} as const;

const prisma = new PrismaClient();

function n(v: unknown): number {
  if (v == null) return 0;
  return typeof v === 'number' ? v : Number(v);
}

function round2(v: number): number {
  return Math.round(v * 100) / 100;
}

function round4(v: number): number {
  return Math.round(v * 10000) / 10000;
}

function fmt(v: number): string {
  const neg = v < 0;
  const s = Math.abs(v).toFixed(2).replace('.', ',');
  const [i, d] = s.split(',');
  const withDots = i.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${neg ? '-' : ''}R$ ${withDots},${d}`;
}

function sep(t: string) {
  console.log('\n' + '═'.repeat(72));
  console.log(` ${t}`);
  console.log('═'.repeat(72));
}

function findWorkbook(): string {
  const dir = 'D:/mods/mds sa/mods the sims';
  const files = fs.readdirSync(dir).filter((f) =>
    f.toLowerCase().includes('uberaba') && f.toLowerCase().endsWith('.xlsx'),
  );
  if (!files.length) throw new Error('Planilha Uberaba não encontrada');
  return path.join(dir, files[0]);
}

type DiffMotivo =
  | 'ok'
  | 'fora_do_catalogo'
  | 'config_inativa'
  | 'sem_match'
  | 'custo_pendente'
  | 'custo_recalculado'
  | 'categoria_diferente'
  | 'qtd_diferente'
  | 'custo_diferente'
  | 'valor_diferente'
  | 'agregado_mesmo_insumo'
  | 'so_no_banco'
  | 'so_na_planilha'
  | 'compras_novembro'
  | 'outro';

async function main() {
  console.log('DIAGNÓSTICO CMV UBERABA — estoque inicial nov/2026');
  console.log('Modo: SOMENTE LEITURA (sem montarFechamento)');

  const wbPath = findWorkbook();
  const wb = XLSX.readFile(wbPath);
  const outSheet =
    wb.SheetNames.find((s) => s.trim().toUpperCase() === 'OUTUBRO') ??
    wb.SheetNames.find((s) => s.toUpperCase().includes('OUTUBRO'));
  if (!outSheet) throw new Error(`Aba OUTUBRO não encontrada: ${wb.SheetNames}`);
  console.log(`Planilha: ${wbPath}`);
  console.log(`Aba: "${outSheet}"`);

  const planLinhas = parseSaldoDaAba(wb.Sheets[outSheet]);
  const planMp = planLinhas.filter((l) => l.secao === 'MATERIA_PRIMA');
  const planBeb = planLinhas.filter((l) => l.secao === 'BEBIDA');
  const sumPlan = (ls: LinhaSaldoPlanilha[]) =>
    round2(ls.reduce((a, l) => a + (l.valorFinal || 0), 0));

  sep('0. Totais planilha (AH = valor final out)');
  console.log(`MP linhas=${planMp.length} soma AH=${fmt(sumPlan(planMp))} (esperado ${fmt(PLANILHA.MATERIA_PRIMA)})`);
  console.log(`BEB linhas=${planBeb.length} soma AH=${fmt(sumPlan(planBeb))} (esperado ${fmt(PLANILHA.BEBIDA)})`);
  console.log(
    `EMB soma AH=${fmt(sumPlan(planLinhas.filter((l) => l.secao === 'EMBALAGEM')))}`,
  );

  const configs = await prisma.cmvRealInsumoConfig.findMany({
    where: { userId: OWNER },
    include: { estoqueInsumo: { select: { id: true, nome: true } } },
  });
  const cfgById = new Map(configs.map((c) => [c.estoqueInsumoId, c]));
  const ativos = configs.filter((c) => c.ativo);
  const ativosById = new Map(ativos.map((c) => [c.estoqueInsumoId, c]));
  const catalogoMatch = ativos.map((c) => ({
    id: c.estoqueInsumoId,
    nome: c.estoqueInsumo.nome,
    nomeNormalizado: normalizarDescricao(c.estoqueInsumo.nome),
    secao: c.secao,
    unidade: c.unidade,
    ativo: true as const,
  }));

  const saldosOut = await prisma.cmvSaldoEstoque.findMany({
    where: { userId: OWNER, storeSlug: STORE, competencia: COMP_ANT },
  });
  const saldosNov = await prisma.cmvSaldoEstoque.findMany({
    where: { userId: OWNER, storeSlug: STORE, competencia: COMP },
  });
  const fechOut = await prisma.cmvFechamento.findUnique({
    where: {
      userId_storeSlug_competencia: {
        userId: OWNER,
        storeSlug: STORE,
        competencia: COMP_ANT,
      },
    },
  });
  const fechNov = await prisma.cmvFechamento.findUnique({
    where: {
      userId_storeSlug_competencia: {
        userId: OWNER,
        storeSlug: STORE,
        competencia: COMP,
      },
    },
  });

  sep('0b. Fechamentos / saldos banco');
  console.log(
    `Out: ${fechOut?.status ?? 'N/A'} manuais=${JSON.stringify(fechOut?.valoresManuais ?? null)}`,
  );
  console.log(
    `Nov: ${fechNov?.status ?? 'N/A'} manuais=${JSON.stringify(fechNov?.valoresManuais ?? null)}`,
  );
  console.log(
    `Saldos out=${saldosOut.length} nov=${saldosNov.length} | configs ativos=${ativos.length}/${configs.length}`,
  );

  // Enrich DB rows
  type DbRow = {
    id: string;
    nome: string;
    qtd: number;
    custo: number | null;
    valor: number;
    origem: string | null;
    detalhe: string | null;
    cfgAtivo: boolean | null;
    cfgSecao: string | null;
    cfgUnidade: string | null;
  };

  const dbRows: DbRow[] = [];
  for (const s of saldosOut) {
    const cfg = cfgById.get(s.estoqueInsumoId);
    const qtd = n(s.qtdFinal);
    const custo = s.custoMedio != null ? n(s.custoMedio) : null;
    dbRows.push({
      id: s.estoqueInsumoId,
      nome: cfg?.estoqueInsumo.nome ?? s.estoqueInsumoId,
      qtd,
      custo,
      valor: round2(qtd * (custo ?? 0)),
      origem: s.custoOrigem,
      detalhe: s.custoOrigemDetalhe,
      cfgAtivo: cfg ? cfg.ativo : null,
      cfgSecao: cfg?.secao ?? null,
      cfgUnidade: cfg?.unidade ?? null,
    });
  }
  const orphanIds = dbRows.filter((r) => !cfgById.has(r.id)).map((r) => r.id);
  if (orphanIds.length) {
    const insumos = await prisma.estoqueInsumo.findMany({
      where: { id: { in: orphanIds } },
      select: { id: true, nome: true },
    });
    const m = new Map(insumos.map((i) => [i.id, i.nome]));
    for (const r of dbRows) {
      if (m.has(r.id)) r.nome = m.get(r.id)!;
    }
  }

  sep('1. Soma saldo outubro no banco (qtd × custoMedio)');
  const sumBy = (
    pred: (r: DbRow) => boolean,
  ): Record<string, { n: number; valor: number }> => {
    const out: Record<string, { n: number; valor: number }> = {};
    for (const r of dbRows) {
      if (!pred(r)) continue;
      const sec = r.cfgSecao ?? 'FORA_CATALOGO';
      if (!out[sec]) out[sec] = { n: 0, valor: 0 };
      out[sec].n += 1;
      out[sec].valor += r.valor;
    }
    return out;
  };
  const allSec = sumBy(() => true);
  const ativoSec = sumBy((r) => r.cfgAtivo === true);
  console.log('Todos saldos (com cfg ou fora):');
  for (const [sec, a] of Object.entries(allSec).sort()) {
    console.log(`  ${sec.padEnd(16)} n=${a.n} ${fmt(round2(a.valor))}`);
  }
  console.log('Só catálogo ATIVO:');
  for (const [sec, a] of Object.entries(ativoSec).sort()) {
    console.log(`  ${sec.padEnd(16)} n=${a.n} ${fmt(round2(a.valor))}`);
  }
  for (const secao of ['MATERIA_PRIMA', 'BEBIDA'] as const) {
    const plan = PLANILHA[secao];
    const bruto = round2(allSec[secao]?.valor ?? 0);
    const ativo = round2(ativoSec[secao]?.valor ?? 0);
    console.log(
      `  [${secao}] plan=${fmt(plan)} dbCfg=${fmt(bruto)} (Δ=${fmt(plan - bruto)}) ativo=${fmt(ativo)} card=${fmt(CARD[secao])} (Δ card-ativo=${fmt(CARD[secao] - ativo)})`,
    );
  }

  // Lançamentos nov
  sep('2. Lançamentos novembro');
  const lancs = await prisma.cmvLancamento.findMany({
    where: { userId: OWNER, storeSlug: STORE, competencia: COMP },
    include: { nfeItem: { select: { cfop: true } } },
  });
  console.log(`Total lançamentos: ${lancs.length}`);
  const byTipo: Record<string, { n: number; valor: number }> = {};
  const bySecaoTipo: Record<string, Record<string, { n: number; valor: number }>> = {};
  for (const l of lancs) {
    const cfg = ativosById.get(l.estoqueInsumoId);
    const secao = cfg?.secao ?? 'FORA/INATIVO';
    const tipo = l.tipo;
    if (!byTipo[tipo]) byTipo[tipo] = { n: 0, valor: 0 };
    byTipo[tipo].n += 1;
    byTipo[tipo].valor += n(l.valorTotal);
    if (!bySecaoTipo[secao]) bySecaoTipo[secao] = {};
    if (!bySecaoTipo[secao][tipo]) bySecaoTipo[secao][tipo] = { n: 0, valor: 0 };
    bySecaoTipo[secao][tipo].n += 1;
    bySecaoTipo[secao][tipo].valor += n(l.valorTotal);
  }
  for (const [t, m] of Object.entries(byTipo).sort()) {
    console.log(`  ${t.padEnd(22)} n=${m.n} ${fmt(round2(m.valor))}`);
  }
  for (const [secao, tipos] of Object.entries(bySecaoTipo).sort()) {
    for (const [t, m] of Object.entries(tipos).sort()) {
      console.log(`  ${secao}/${t}: n=${m.n} ${fmt(round2(m.valor))}`);
    }
  }

  // Replica CMV parcial
  sep('3. Replica card nov (fim=0 se sem saldo nov)');
  const iniMap = new Map(saldosOut.map((s) => [s.estoqueInsumoId, s]));
  const fimMap = new Map(saldosNov.map((s) => [s.estoqueInsumoId, s]));
  console.log(`semEstoqueFinal=${fimMap.size === 0} (saldosNov=${fimMap.size})`);

  type Linha = {
    id: string;
    nome: string;
    secao: string;
    unidade: string;
    qtdIni: number;
    custoIni: number | null;
    origemIni: string | null;
    valorIni: number;
    comprasValor: number;
    consumoValor: number;
  };
  const linhas: Linha[] = [];
  for (const cfg of ativos) {
    const id = cfg.estoqueInsumoId;
    const ini = iniMap.get(id);
    const fim = fimMap.get(id);
    const itemLancs = lancs.filter((l) => l.estoqueInsumoId === id);
    let comprasQtd = 0;
    let comprasValor = 0;
    let transfEnv = 0;
    let transfRec = 0;
    let desp = 0;
    for (const l of itemLancs) {
      const q = n(l.quantidade);
      const v = n(l.valorTotal);
      if (l.tipo === 'COMPRA_NFE' || l.tipo === 'COMPRA_MANUAL') {
        const cfop = l.tipo === 'COMPRA_NFE' ? l.nfeItem?.cfop : null;
        const dig = cfop ? Number(String(cfop).replace(/\D/g, '').slice(0, 1)) : null;
        const neg = dig === 1 || dig === 2;
        comprasQtd += neg ? -q : q;
        comprasValor += neg ? -v : v;
      } else if (l.tipo === 'TRANSFERENCIA_SAIDA') transfEnv += v;
      else if (l.tipo === 'TRANSFERENCIA_ENTRADA') transfRec += v;
      else if (l.tipo === 'DESPERDICIO') desp += v;
    }
    const qtdIni = n(ini?.qtdFinal);
    const custoIni = ini?.custoMedio != null ? n(ini.custoMedio) : null;
    const qtdFim = n(fim?.qtdFinal);
    const custoFim = fim?.custoMedio != null ? n(fim.custoMedio) : null;
    const entradasQtd = qtdIni + comprasQtd;
    const custoMedio =
      entradasQtd > 0
        ? (qtdIni * (custoIni ?? 0) + comprasValor) / entradasQtd
        : custoFim ?? custoIni ?? 0;
    const valorIni = qtdIni * (custoIni ?? custoMedio);
    const valorFim = qtdFim * (custoFim ?? custoMedio);
    const consumoValor = round2(
      valorIni + comprasValor + transfRec - transfEnv - desp - valorFim,
    );
    linhas.push({
      id,
      nome: cfg.estoqueInsumo.nome,
      secao: cfg.secao,
      unidade: cfg.unidade,
      qtdIni,
      custoIni,
      origemIni: ini?.custoOrigem ?? null,
      valorIni: round2(valorIni),
      comprasValor: round2(comprasValor),
      consumoValor,
    });
  }
  for (const secao of ['MATERIA_PRIMA', 'EMBALAGEM', 'BEBIDA'] as const) {
    const ls = linhas.filter((l) => l.secao === secao);
    const cmv = round2(ls.reduce((a, l) => a + l.consumoValor, 0));
    const ini = round2(ls.reduce((a, l) => a + l.valorIni, 0));
    const comp = round2(ls.reduce((a, l) => a + l.comprasValor, 0));
    console.log(`  ${secao}: CMV=${fmt(cmv)} ini=${fmt(ini)} compras=${fmt(comp)}`);
  }

  // Match planilha → catálogo / banco
  sep('4. Match planilha ↔ banco (item a item com diferença)');

  type DiffRow = {
    produto: string;
    secaoPlan: string;
    secaoDb: string | null;
    qtdPlan: number;
    custoPlan: number | null;
    valorPlan: number;
    qtdDb: number | null;
    custoDb: number | null;
    valorDb: number | null;
    qtdNov: number | null;
    custoNov: number | null;
    valorNov: number | null;
    diff: number;
    motivo: DiffMotivo;
    detalhe: string;
  };

  const diffs: DiffRow[] = [];
  const usedDbIds = new Set<string>();

  // Aggregate plan lines that match same catalog id
  type PlanAgg = {
    nomes: string[];
    secao: string;
    qtd: number;
    valor: number;
    custo: number | null; // weighted
    linhas: number[];
    matchId: string | null;
    matchNome: string | null;
    matchStatus: string;
    matchSecao: string | null;
    matchAtivo: boolean | null;
  };

  const planAggs: PlanAgg[] = [];
  const byMatch = new Map<string, PlanAgg>();

  for (const pl of planLinhas) {
    if ((pl.qtdFinal || 0) === 0 && (pl.valorFinal || 0) === 0) continue;
    const match = matchNomeProdutoLista(pl.nome, catalogoMatch);
    const key = match.item?.id ?? `UNMATCHED::${normalizarDescricao(pl.nome)}::${pl.secao}`;
    let agg = byMatch.get(key);
    if (!agg) {
      const cfg = match.item ? cfgById.get(match.item.id) : null;
      agg = {
        nomes: [],
        secao: pl.secao,
        qtd: 0,
        valor: 0,
        custo: null,
        linhas: [],
        matchId: match.item?.id ?? null,
        matchNome: match.item?.nome ?? null,
        matchStatus: match.status,
        matchSecao: cfg?.secao ?? match.item?.secao ?? null,
        matchAtivo: cfg ? cfg.ativo : match.item ? true : null,
      };
      byMatch.set(key, agg);
      planAggs.push(agg);
    }
    // If sections conflict among aggregated plan lines, keep first but note
    agg.nomes.push(pl.nome);
    agg.linhas.push(pl.linha);
    agg.qtd += pl.qtdFinal || 0;
    agg.valor += pl.valorFinal || 0;
  }
  for (const agg of planAggs) {
    agg.qtd = round4(agg.qtd);
    agg.valor = round2(agg.valor);
    agg.custo = agg.qtd > 0 ? round4(agg.valor / agg.qtd) : null;
  }

  for (const agg of planAggs) {
    const produto = agg.nomes[0] + (agg.nomes.length > 1 ? ` (+${agg.nomes.length - 1})` : '');
    const db = agg.matchId
      ? dbRows.find((r) => r.id === agg.matchId) ?? null
      : null;
    const novLinha = agg.matchId
      ? linhas.find((l) => l.id === agg.matchId) ?? null
      : null;

    if (agg.matchId) usedDbIds.add(agg.matchId);

    let motivo: DiffMotivo = 'ok';
    const notes: string[] = [];

    if (!agg.matchId || agg.matchStatus === 'nao_encontrado') {
      motivo = 'sem_match';
      notes.push('sem match no catálogo ativo');
    } else if (agg.matchAtivo === false) {
      motivo = 'config_inativa';
      notes.push('config CMV inativa');
    } else if (agg.matchSecao && agg.matchSecao !== agg.secao) {
      motivo = 'categoria_diferente';
      notes.push(`planilha=${agg.secao} catálogo=${agg.matchSecao}`);
    }

    const qtdDb = db?.qtd ?? null;
    const custoDb = db?.custo ?? null;
    const valorDb = db ? db.valor : null;

    if (motivo === 'ok' || motivo === 'categoria_diferente') {
      if (!db) {
        // matched catalog but no October saldo row
        if (agg.valor !== 0) {
          motivo = motivo === 'categoria_diferente' ? motivo : 'so_na_planilha';
          notes.push('match catálogo mas sem CmvSaldoEstoque out');
        }
      } else {
        if (db.origem === 'PENDENTE' || (db.qtd > 0 && (db.custo == null || db.custo === 0))) {
          if (motivo === 'ok') motivo = 'custo_pendente';
          notes.push(`custo origem=${db.origem}`);
        } else if (db.origem && db.origem !== 'PLANILHA' && db.origem !== 'PLANILHA_RECALCULADO') {
          if (motivo === 'ok') motivo = 'custo_recalculado';
          notes.push(`origem=${db.origem} ${db.detalhe ?? ''}`);
        }
        if (Math.abs((qtdDb ?? 0) - agg.qtd) > 0.0006) {
          if (motivo === 'ok') motivo = 'qtd_diferente';
          notes.push(`qtd plan=${agg.qtd} db=${qtdDb}`);
        }
        if (
          agg.custo != null &&
          custoDb != null &&
          Math.abs(agg.custo - custoDb) > 0.0006
        ) {
          if (motivo === 'ok') motivo = 'custo_diferente';
          notes.push(`custo plan=${agg.custo} db=${custoDb}`);
        }
        if (Math.abs((valorDb ?? 0) - agg.valor) > 0.015) {
          if (motivo === 'ok') motivo = 'valor_diferente';
          notes.push(`valor plan=${agg.valor} db=${valorDb}`);
        }
        if (agg.nomes.length > 1) {
          notes.push(`agregou ${agg.nomes.length} linhas planilha no mesmo insumo`);
          if (motivo === 'ok') motivo = 'agregado_mesmo_insumo';
        }
      }
    }

    const valorNov = novLinha?.consumoValor ?? null;
    const custoNov = novLinha?.custoIni ?? null;
    const qtdNov = novLinha?.qtdIni ?? null;

    // Diff = valor usado em nov − valor planilha na seção da planilha
    // Para itens que mudam de seção, o valor "some" de uma e "aparece" na outra
    let valorUsadoNaSecaoPlan: number | null = null;
    if (novLinha) {
      if (novLinha.secao === agg.secao) {
        valorUsadoNaSecaoPlan = novLinha.valorIni;
      } else {
        // está em outra seção no card → contribuindo 0 para a seção da planilha
        valorUsadoNaSecaoPlan = 0;
        if (motivo === 'ok') motivo = 'categoria_diferente';
      }
    } else if (motivo === 'sem_match' || motivo === 'config_inativa' || motivo === 'fora_do_catalogo') {
      valorUsadoNaSecaoPlan = 0;
    } else if (db && db.cfgAtivo && db.cfgSecao === agg.secao) {
      valorUsadoNaSecaoPlan = db.valor;
    } else {
      valorUsadoNaSecaoPlan = 0;
    }

    const diff = round2((valorUsadoNaSecaoPlan ?? 0) - agg.valor);

    if (Math.abs(diff) > 0.01 || motivo !== 'ok') {
      diffs.push({
        produto: produto,
        secaoPlan: agg.secao,
        secaoDb: novLinha?.secao ?? db?.cfgSecao ?? agg.matchSecao,
        qtdPlan: agg.qtd,
        custoPlan: agg.custo,
        valorPlan: agg.valor,
        qtdDb,
        custoDb,
        valorDb,
        qtdNov,
        custoNov,
        valorNov: valorUsadoNaSecaoPlan,
        diff,
        motivo,
        detalhe: notes.join('; '),
      });
    }

    // Also check compras novembro contribution
    if (novLinha && Math.abs(novLinha.comprasValor) > 0.01) {
      diffs.push({
        produto: `${produto} [compras nov]`,
        secaoPlan: agg.secao,
        secaoDb: novLinha.secao,
        qtdPlan: agg.qtd,
        custoPlan: agg.custo,
        valorPlan: 0,
        qtdDb: null,
        custoDb: null,
        valorDb: 0,
        qtdNov: novLinha.qtdIni,
        custoNov: novLinha.custoIni,
        valorNov: novLinha.comprasValor,
        diff: novLinha.comprasValor,
        motivo: 'compras_novembro',
        detalhe: `compras nov ${fmt(novLinha.comprasValor)} entram no CMV parcial`,
      });
    }
  }

  // DB rows not matched from planilha (same section active)
  for (const r of dbRows) {
    if (usedDbIds.has(r.id)) continue;
    if (r.qtd === 0 && r.valor === 0) continue;
    const novLinha = linhas.find((l) => l.id === r.id);
    diffs.push({
      produto: r.nome,
      secaoPlan: '(ausente)',
      secaoDb: r.cfgSecao,
      qtdPlan: 0,
      custoPlan: null,
      valorPlan: 0,
      qtdDb: r.qtd,
      custoDb: r.custo,
      valorDb: r.valor,
      qtdNov: novLinha?.qtdIni ?? null,
      custoNov: novLinha?.custoIni ?? null,
      valorNov: novLinha?.valorIni ?? (r.cfgAtivo ? r.valor : 0),
      diff: round2((novLinha?.valorIni ?? (r.cfgAtivo ? r.valor : 0)) - 0),
      motivo: 'so_no_banco',
      detalhe: `saldo out no banco sem correspondente na planilha (ativo=${r.cfgAtivo})`,
    });
  }

  // Print diffs by section focus
  for (const secao of ['MATERIA_PRIMA', 'BEBIDA'] as const) {
    sep(`5. Diferenças — ${secao} (valor nov − valor planilha)`);
    const rows = diffs
      .filter(
        (d) =>
          d.secaoPlan === secao ||
          (d.secaoPlan === '(ausente)' && d.secaoDb === secao) ||
          (d.motivo === 'compras_novembro' && d.secaoDb === secao),
      )
      .sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff));

    console.log(
      'produto | qtdPlan | custoPlan | valorPlan | qtdDb | custoDb | valorDb | qtdNov | custoNov | valorNov | diff | motivo | detalhe',
    );
    let sumDiff = 0;
    for (const d of rows) {
      // For section gap closing: only count diffs that affect this section's card vs planilha
      sumDiff += d.diff;
      console.log(
        [
          d.produto,
          d.qtdPlan,
          d.custoPlan ?? '',
          d.valorPlan,
          d.qtdDb ?? '',
          d.custoDb ?? '',
          d.valorDb ?? '',
          d.qtdNov ?? '',
          d.custoNov ?? '',
          d.valorNov ?? '',
          d.diff,
          d.motivo,
          d.detalhe,
        ].join(' | '),
      );
    }
    console.log(`SOMA diffs listados ${secao}: ${fmt(round2(sumDiff))}`);
    console.log(
      `Gap planilha−card esperado: ${fmt(PLANILHA[secao] - CARD[secao])} (card−plan=${fmt(CARD[secao] - PLANILHA[secao])})`,
    );
  }

  sep('6. Fechamento da conta (planilha − card)');
  for (const secao of ['MATERIA_PRIMA', 'BEBIDA'] as const) {
    const plan = PLANILHA[secao];
    const card = CARD[secao];
    const cmv = round2(
      linhas.filter((l) => l.secao === secao).reduce((a, l) => a + l.consumoValor, 0),
    );
    const iniAtivo = round2(
      linhas.filter((l) => l.secao === secao).reduce((a, l) => a + l.valorIni, 0),
    );
    const planSoma = sumPlan(planLinhas.filter((l) => l.secao === secao));

    // Recompute gap components
    let fora = 0; // plan value not entering card (no match / inactive / other section)
    let custoGap = 0; // same item, different value
    let soBanco = 0; // in card but not in plan section
    let compras = 0;

    for (const agg of planAggs) {
      if (agg.secao !== secao) continue;
      const nov = agg.matchId ? linhas.find((l) => l.id === agg.matchId) : null;
      if (!nov || nov.secao !== secao) {
        fora += agg.valor;
      } else {
        custoGap += round2(nov.valorIni - agg.valor);
      }
    }
    for (const l of linhas.filter((x) => x.secao === secao)) {
      const matched = planAggs.some(
        (a) => a.matchId === l.id && a.secao === secao,
      );
      if (!matched && l.valorIni !== 0) {
        // either unmatched plan section or only in DB
        const fromOtherPlan = planAggs.find(
          (a) => a.matchId === l.id && a.secao !== secao,
        );
        if (fromOtherPlan) {
          soBanco += l.valorIni; // came from other plan section
        } else if (!planAggs.some((a) => a.matchId === l.id)) {
          soBanco += l.valorIni;
        }
      }
      compras += l.comprasValor;
    }

    fora = round2(fora);
    custoGap = round2(custoGap);
    soBanco = round2(soBanco);
    compras = round2(compras);

    // card ≈ plan - fora + soBanco + custoGap + compras
    const reconstr = round2(planSoma - fora + soBanco + custoGap + compras);

    console.log(`\n${secao}:`);
    console.log(`  planilha AH = ${fmt(planSoma)}`);
    console.log(`  card UI = ${fmt(card)} | CMV replicado = ${fmt(cmv)} | ini ativo = ${fmt(iniAtivo)}`);
    console.log(`  − fora do card (sem match/inativo/outra seção) = ${fmt(fora)}`);
    console.log(`  + só no card (outra seção plan ou só banco) = ${fmt(soBanco)}`);
    console.log(`  ± gap custo/qtd (mesma seção) = ${fmt(custoGap)}`);
    console.log(`  + compras nov = ${fmt(compras)}`);
    console.log(`  reconstruto = ${fmt(reconstr)} (Δ vs card ${fmt(card - reconstr)})`);
    console.log(`  plan − card = ${fmt(plan - card)}`);
  }

  sep('7. Origem dos custos no saldo out (ativos)');
  const orig: Record<string, { n: number; valor: number }> = {};
  for (const r of dbRows.filter((x) => x.cfgAtivo)) {
    const o = r.origem ?? 'NULL';
    if (!orig[o]) orig[o] = { n: 0, valor: 0 };
    orig[o].n += 1;
    orig[o].valor += r.valor;
  }
  for (const [o, a] of Object.entries(orig).sort()) {
    console.log(`  ${o.padEnd(22)} n=${a.n} ${fmt(round2(a.valor))}`);
  }

  sep('8. Itens planilha MP/BEB que mudam de seção no catálogo');
  for (const agg of planAggs.filter(
    (a) =>
      (a.secao === 'MATERIA_PRIMA' || a.secao === 'BEBIDA') &&
      a.matchSecao &&
      a.matchSecao !== a.secao,
  )) {
    console.log(
      `  plan[${agg.secao}]→cfg[${agg.matchSecao}] ${agg.nomes[0]} valor=${fmt(agg.valor)} qtd=${agg.qtd} match=${agg.matchNome}`,
    );
  }

  sep('9. Itens planilha MP/BEB sem match ativo');
  for (const agg of planAggs.filter(
    (a) =>
      (a.secao === 'MATERIA_PRIMA' || a.secao === 'BEBIDA') &&
      (!a.matchId || a.matchAtivo === false),
  )) {
    console.log(
      `  [${agg.secao}] ${agg.nomes[0]} valor=${fmt(agg.valor)} qtd=${agg.qtd} status=${agg.matchStatus}`,
    );
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
