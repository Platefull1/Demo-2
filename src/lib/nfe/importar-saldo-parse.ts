/**
 * Parser puro do saldo da planilha CMV (sem Prisma).
 * Colunas: B=produto, E/AF=unidade, AE=qtd final, AG=custo médio.
 * Recálculo: (G+K+N+Q+T+W)/(D+I+L+O+R+U) quando AG inválido.
 */

import * as XLSX from 'xlsx';
import {
  cellStr,
  detectarAncoraSecao,
  isFimBlocoInventario,
  lerLinhaProduto,
  type CmvRealSecao,
} from './importar-planilha-secoes';
import { normalizarDescricao } from './normalize';

export type { CmvRealSecao };

/** Colunas 0-based */
const COL_QTD_INI = 3; // D
const COL_VAL_INI = 6; // G
const COL_COMPRAS_QTD = [8, 11, 14, 17, 20] as const; // I L O R U
const COL_COMPRAS_VAL = [10, 13, 16, 19, 22] as const; // K N Q T W
const COL_QTD = 30; // AE
const COL_CUSTO = 32; // AG

export type CustoOrigemSaldo =
  | 'PLANILHA'
  | 'PLANILHA_RECALCULADO'
  | 'ULTIMA_COMPRA_LOJA'
  | 'ULTIMA_COMPRA_GRUPO'
  | 'OUTRA_LOJA'
  | 'PLANILHA_MES_ANTERIOR'
  | 'CMV_TEORICO'
  | 'MANUAL'
  | 'PENDENTE';

export type LinhaSaldoPlanilha = {
  linha: number;
  nome: string;
  secao: CmvRealSecao;
  unidadeRaw: string;
  qtdFinal: number;
  /** Custo lido da planilha AG (null se inválido: #DIV/0!, vazio, 0). */
  custoPlanilha: number | null;
  /**
   * Custo recalculado da linha: (G+K+N+Q+T+W)/(D+I+L+O+R+U)
   * quando numerador e denominador > 0.
   */
  custoRecalculado: number | null;
  /** Custo efetivo após fallbacks (pode ainda ser null = pendente). */
  custoMedio: number | null;
  custoOrigem: CustoOrigemSaldo | null;
  custoOrigemDetalhe: string | null;
  /** true se veio de mês anterior com > 3 meses de atraso */
  custoAntigo?: boolean;
};

const MESES_PT: Record<string, number> = {
  janeiro: 1,
  fevereiro: 2,
  marco: 3,
  março: 3,
  abril: 4,
  maio: 5,
  junho: 6,
  julho: 7,
  agosto: 8,
  setembro: 9,
  outubro: 10,
  novembro: 11,
  dezembro: 12,
  jan: 1,
  fev: 2,
  mar: 3,
  abr: 4,
  mai: 5,
  jun: 6,
  jul: 7,
  ago: 8,
  set: 9,
  out: 10,
  nov: 11,
  dez: 12,
};

export function cellNum(ws: XLSX.WorkSheet, r: number, c: number): number | null {
  const ref = XLSX.utils.encode_cell({ r, c });
  const cell = ws[ref] as XLSX.CellObject | undefined;
  if (!cell) return null;
  if (cell.t === 'e') return null;
  const rawW = cell.w != null ? String(cell.w).trim() : '';
  if (/^#(DIV\/0!|N\/A|VALUE!|REF!|NAME\?|NUM!|NULL!)/i.test(rawW)) return null;
  if (typeof cell.v === 'number' && Number.isFinite(cell.v)) return cell.v;
  if (rawW) {
    const n = Number(rawW.replace(/\./g, '').replace(',', '.'));
    return Number.isFinite(n) ? n : null;
  }
  if (cell.v != null) {
    const n = Number(cell.v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

/** Custo válido na planilha: número finito e > 0. */
export function isCustoPlanilhaValido(custo: number | null): custo is number {
  return custo != null && Number.isFinite(custo) && custo > 0;
}

/**
 * Recalcula custo médio da linha:
 * (G+K+N+Q+T+W) / (D+I+L+O+R+U)
 */
export function recalcularCustoLinha(
  ws: XLSX.WorkSheet,
  r: number,
): number | null {
  let num = 0;
  let den = 0;
  const g = cellNum(ws, r, COL_VAL_INI);
  if (g != null && g > 0) num += g;
  const d = cellNum(ws, r, COL_QTD_INI);
  if (d != null && d > 0) den += d;

  for (let i = 0; i < COL_COMPRAS_VAL.length; i++) {
    const v = cellNum(ws, r, COL_COMPRAS_VAL[i]);
    const q = cellNum(ws, r, COL_COMPRAS_QTD[i]);
    if (v != null && v > 0) num += v;
    if (q != null && q > 0) den += q;
  }

  if (!(num > 0) || !(den > 0)) return null;
  const u = num / den;
  return Number.isFinite(u) && u > 0 ? Math.round(u * 100) / 100 : null;
}

export function fimCompetenciaUtc(competencia: string): Date {
  const [y, m] = competencia.split('-').map(Number);
  if (!y || !m) throw new Error(`competência inválida: ${competencia}`);
  return new Date(Date.UTC(y, m, 1));
}

/** Extrai YYYY-MM do nome da aba (ex.: "SETEMBRO 2026", "SET/2026"). */
export function competenciaFromAbaNome(nome: string): string | null {
  const raw = String(nome || '').trim();
  if (!raw) return null;
  const iso = raw.match(/(20\d{2})\s*[-/]\s*(\d{1,2})/);
  if (iso) {
    const y = Number(iso[1]);
    const m = Number(iso[2]);
    if (m >= 1 && m <= 12) return `${y}-${String(m).padStart(2, '0')}`;
  }
  const norm = raw
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
  const ym = norm.match(
    /(janeiro|fevereiro|marco|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro|jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez)\s*[\/\-\s]*?(20\d{2})/,
  );
  if (ym) {
    const mes = MESES_PT[ym[1]];
    if (mes) return `${ym[2]}-${String(mes).padStart(2, '0')}`;
  }
  return null;
}

/** Diferença em meses entre duas competências YYYY-MM. */
export function mesesEntreCompetencias(de: string, ate: string): number {
  const [y1, m1] = de.split('-').map(Number);
  const [y2, m2] = ate.split('-').map(Number);
  return (y2 - y1) * 12 + (m2 - m1);
}

/**
 * Lê produtos das 3 seções. Inclui qtd 0. Não exige unidade em E.
 */
export function parseSaldoDaAba(ws: XLSX.WorkSheet): LinhaSaldoPlanilha[] {
  const ref = ws['!ref'];
  if (!ref) return [];
  const range = XLSX.utils.decode_range(ref);
  const out: LinhaSaldoPlanilha[] = [];
  let secaoAtual: CmvRealSecao | null = null;

  for (let r = range.s.r; r <= range.e.r; r++) {
    const ancora = detectarAncoraSecao(ws, r);
    if (ancora) {
      secaoAtual = ancora;
      continue;
    }

    const nomeB = cellStr(ws, r, 1);
    if (nomeB && isFimBlocoInventario(nomeB)) {
      secaoAtual = null;
      continue;
    }

    if (!secaoAtual) continue;

    const prod = lerLinhaProduto(ws, r);
    if (!prod) continue;

    // AE null → trata como 0 (mostra zerados); número 0 entra normalmente
    const qtdRaw = cellNum(ws, r, COL_QTD);
    const qtdFinal = qtdRaw == null ? 0 : qtdRaw;

    const custoRaw = cellNum(ws, r, COL_CUSTO);
    const custoPlanilha = isCustoPlanilhaValido(custoRaw) ? custoRaw : null;
    const custoRecalculado =
      custoPlanilha != null ? null : recalcularCustoLinha(ws, r);

    out.push({
      linha: r + 1,
      nome: prod.nome,
      secao: secaoAtual,
      unidadeRaw: prod.unidadeRaw,
      qtdFinal,
      custoPlanilha,
      custoRecalculado,
      custoMedio: custoPlanilha,
      custoOrigem: custoPlanilha != null ? 'PLANILHA' : null,
      custoOrigemDetalhe: null,
    });
  }

  return out;
}

export function lerSaldoDoBuffer(
  buffer: ArrayBuffer,
  abaNome: string,
): LinhaSaldoPlanilha[] {
  const wb = XLSX.read(buffer, { type: 'array', cellDates: true });
  const ws = wb.Sheets[abaNome];
  if (!ws) throw new Error(`Aba "${abaNome}" não encontrada`);
  return parseSaldoDaAba(ws);
}

export type AgAnteriorHit = {
  custo: number;
  aba: string;
  competencia: string;
  mesesAtraso: number;
  custoAntigo: boolean;
};

/**
 * Busca AG > 0 do mesmo produto (por NOME) em abas mensais anteriores.
 */
export function buscarCustoAgAbasAnteriores(
  buffer: ArrayBuffer,
  competenciaAtual: string,
  nomesProduto: string[],
): Map<string, AgAnteriorHit> {
  const wb = XLSX.read(buffer, { type: 'array', cellDates: true });
  const alvos = new Map(
    nomesProduto.map((n) => [normalizarDescricao(n), n] as const),
  );
  const abas: Array<{ nome: string; competencia: string }> = [];
  for (const nome of wb.SheetNames) {
    const comp = competenciaFromAbaNome(nome);
    if (!comp || comp >= competenciaAtual) continue;
    abas.push({ nome, competencia: comp });
  }
  abas.sort((a, b) => b.competencia.localeCompare(a.competencia));

  const found = new Map<string, AgAnteriorHit>();
  const pending = new Set(alvos.keys());

  for (const aba of abas) {
    if (pending.size === 0) break;
    const ws = wb.Sheets[aba.nome];
    if (!ws) continue;
    const linhas = parseSaldoDaAba(ws);
    for (const l of linhas) {
      const custo =
        isCustoPlanilhaValido(l.custoPlanilha)
          ? l.custoPlanilha
          : isCustoPlanilhaValido(l.custoRecalculado)
            ? l.custoRecalculado
            : null;
      if (custo == null) continue;
      const key = normalizarDescricao(l.nome);
      if (!pending.has(key)) continue;
      const mesesAtraso = mesesEntreCompetencias(aba.competencia, competenciaAtual);
      found.set(key, {
        custo,
        aba: aba.nome,
        competencia: aba.competencia,
        mesesAtraso,
        custoAntigo: mesesAtraso > 3,
      });
      pending.delete(key);
    }
  }

  const byOriginal = new Map<string, AgAnteriorHit>();
  for (const [norm, original] of alvos) {
    const hit = found.get(norm);
    if (hit) byOriginal.set(original, hit);
  }
  return byOriginal;
}
