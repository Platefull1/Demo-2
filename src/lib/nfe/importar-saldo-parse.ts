/**
 * Parser puro do saldo da planilha CMV (sem Prisma).
 * Colunas: B=produto, AE=qtd final, AG=custo médio.
 */

import * as XLSX from 'xlsx';

export type CmvRealSecao = 'MATERIA_PRIMA' | 'EMBALAGEM' | 'BEBIDA';

const COL_NOME = 1; // B
const COL_QTD = 30; // AE
const COL_CUSTO = 32; // AG

const SECAO_ANCHORS: Array<{ re: RegExp; secao: CmvRealSecao }> = [
  { re: /^MAT[EÉ]RIA[\s\-]*PRIMA/i, secao: 'MATERIA_PRIMA' },
  { re: /^EMBALAG/i, secao: 'EMBALAGEM' },
  { re: /^BEBID/i, secao: 'BEBIDA' },
];

export type CustoOrigemSaldo =
  | 'PLANILHA'
  | 'ULTIMA_COMPRA'
  | 'MES_ANTERIOR'
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

function cellStr(ws: XLSX.WorkSheet, r: number, c: number): string {
  const ref = XLSX.utils.encode_cell({ r, c });
  const cell = ws[ref] as XLSX.CellObject | undefined;
  if (!cell) return '';
  if (cell.w != null && String(cell.w).trim()) return String(cell.w).trim();
  if (cell.v != null) return String(cell.v).trim();
  return '';
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
  // m 1-based → Date.UTC(y, m, 1) = dia 1 do mês seguinte
  return new Date(Date.UTC(y, m, 1));
}

/**
 * Lê produtos das 3 seções até o fim de cada uma (próxima âncora ou fim do bloco).
 * Linhas em branco / total não cortam a seção; CMV/VENDA/RESUMO encerram o bloco.
 */
export function parseSaldoDaAba(ws: XLSX.WorkSheet): LinhaSaldoPlanilha[] {
  const ref = ws['!ref'];
  if (!ref) return [];
  const range = XLSX.utils.decode_range(ref);
  const out: LinhaSaldoPlanilha[] = [];
  let secaoAtual: CmvRealSecao | null = null;

  for (let r = range.s.r; r <= range.e.r; r++) {
    const nomeB = cellStr(ws, r, COL_NOME);
    if (!nomeB) continue;

    const anchor = SECAO_ANCHORS.find((a) => a.re.test(nomeB));
    if (anchor) {
      secaoAtual = anchor.secao;
      continue;
    }

    if (/^(cmv\b|venda\b|resumo)/i.test(nomeB)) {
      secaoAtual = null;
      continue;
    }

    if (!secaoAtual) continue;

    if (/^(total|soma)\b/i.test(nomeB)) continue;
    if (nomeB.length < 2) continue;

    const qtd = cellNum(ws, r, COL_QTD);
    if (qtd == null) continue;

    const custoRaw = cellNum(ws, r, COL_CUSTO);
    const custoPlanilha = isCustoPlanilhaValido(custoRaw) ? custoRaw : null;

    out.push({
      linha: r + 1,
      nome: nomeB,
      secao: secaoAtual,
      qtdFinal: qtd,
      custoPlanilha,
      custoMedio: custoPlanilha,
      custoOrigem: custoPlanilha != null ? 'PLANILHA' : null,
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
