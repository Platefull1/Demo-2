/**
 * Parser puro do saldo da planilha CMV (sem Prisma).
 * Colunas: B=produto, E=unidade, AE=qtd final, AG=custo médio.
 * Seções: âncora compartilhada (B exato + D="ESTOQUE INICIAL").
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

const COL_QTD = 30; // AE
const COL_CUSTO = 32; // AG

export type CustoOrigemSaldo =
  | 'PLANILHA'
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
  qtdFinal: number;
  /** Custo lido da planilha (null se inválido: #DIV/0!, vazio, 0). */
  custoPlanilha: number | null;
  /** Custo efetivo após fallbacks (pode ainda ser null = pendente). */
  custoMedio: number | null;
  custoOrigem: CustoOrigemSaldo | null;
  custoOrigemDetalhe: string | null;
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

function cellNum(ws: XLSX.WorkSheet, r: number, c: number): number | null {
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
 * Limite exclusivo da competência (início do mês seguinte, UTC).
 * Use com `data: { lt: fimCompetenciaUtc(comp) }` para incluir o mês inteiro em BRT.
 */
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

/**
 * Lê produtos das 3 seções até o fim de cada uma (próxima âncora ou fim do bloco).
 * Âncora: B exato + D="ESTOQUE INICIAL". Produto: B + E + AE (qtd).
 * Linhas "EMBALAGEM 20" etc. NÃO são âncoras.
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

    const qtd = cellNum(ws, r, COL_QTD);
    if (qtd == null) continue;

    const custoRaw = cellNum(ws, r, COL_CUSTO);
    const custoPlanilha = isCustoPlanilhaValido(custoRaw) ? custoRaw : null;

    out.push({
      linha: r + 1,
      nome: prod.nome,
      secao: secaoAtual,
      qtdFinal: qtd,
      custoPlanilha,
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

/**
 * Para cada produto, busca o AG válido (>0) na aba mensal mais recente anterior
 * à competência atual (voltando mês a mês).
 */
export function buscarCustoAgAbasAnteriores(
  buffer: ArrayBuffer,
  competenciaAtual: string,
  nomesProduto: string[],
): Map<string, { custo: number; aba: string; competencia: string }> {
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

  const found = new Map<string, { custo: number; aba: string; competencia: string }>();
  const pending = new Set(alvos.keys());

  for (const aba of abas) {
    if (pending.size === 0) break;
    const ws = wb.Sheets[aba.nome];
    if (!ws) continue;
    const linhas = parseSaldoDaAba(ws);
    for (const l of linhas) {
      if (!isCustoPlanilhaValido(l.custoPlanilha)) continue;
      const key = normalizarDescricao(l.nome);
      if (!pending.has(key)) continue;
      found.set(key, {
        custo: l.custoPlanilha,
        aba: aba.nome,
        competencia: aba.competencia,
      });
      pending.delete(key);
    }
  }

  // remapeia chave normalizada → nome original pedido
  const byOriginal = new Map<string, { custo: number; aba: string; competencia: string }>();
  for (const [norm, original] of alvos) {
    const hit = found.get(norm);
    if (hit) byOriginal.set(original, hit);
  }
  return byOriginal;
}
