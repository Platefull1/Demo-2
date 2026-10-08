/**
 * Importação de SALDO (estoque final + custo médio) da planilha CMV DESPERDÍCIO.
 * Colunas: B=produto, AE=qtd final, AG=custo médio.
 * NÃO ler o bloco de resumo a partir da linha 187 (I187+).
 */

import * as XLSX from 'xlsx';
import { prisma } from '@/lib/prisma';
import {
  matchCatalogoPorNome,
  type EstoqueCatalogoItem,
} from '@/lib/estoque/catalogo';
import { listarAbas } from './importar-catalogo';
import { normalizarDescricao } from './normalize';

/** Linha Excel 1-based; resumo começa em 187 → parar em r < 186 (0-based). */
const MAX_ROW_EXCLUSIVE = 186; // não incluir linha 187+
const COL_NOME = 1; // B
const COL_QTD = 30; // AE
const COL_CUSTO = 32; // AG

export type LinhaSaldoPlanilha = {
  linha: number;
  nome: string;
  qtdFinal: number;
  custoMedio: number | null;
};

export type PreviewSaldoItem = LinhaSaldoPlanilha & {
  status: 'casado' | 'sugerido' | 'nao_encontrado';
  estoqueInsumoId?: string;
  estoqueNome?: string;
  score?: number;
};

function cellNum(ws: XLSX.WorkSheet, r: number, c: number): number | null {
  const ref = XLSX.utils.encode_cell({ r, c });
  const cell = ws[ref] as XLSX.CellObject | undefined;
  if (!cell) return null;
  if (typeof cell.v === 'number' && Number.isFinite(cell.v)) return cell.v;
  if (cell.w != null) {
    const n = Number(String(cell.w).replace(/\./g, '').replace(',', '.'));
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

export function parseSaldoDaAba(ws: XLSX.WorkSheet): LinhaSaldoPlanilha[] {
  const ref = ws['!ref'];
  if (!ref) return [];
  const range = XLSX.utils.decode_range(ref);
  const out: LinhaSaldoPlanilha[] = [];
  const maxR = Math.min(range.e.r, MAX_ROW_EXCLUSIVE - 1);

  for (let r = range.s.r; r <= maxR; r++) {
    const nome = cellStr(ws, r, COL_NOME);
    if (!nome || nome.length < 2) continue;
    if (/^(total|soma|cmv|venda|mat[eé]ria|embalag|bebid)/i.test(nome)) continue;

    const qtd = cellNum(ws, r, COL_QTD);
    const custo = cellNum(ws, r, COL_CUSTO);
    if (qtd == null && custo == null) continue;
    if (qtd == null) continue;

    out.push({
      linha: r + 1,
      nome,
      qtdFinal: qtd,
      custoMedio: custo,
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

export function previewSaldoComCatalogo(
  linhas: LinhaSaldoPlanilha[],
  catalogo: EstoqueCatalogoItem[],
): PreviewSaldoItem[] {
  return linhas.map((l) => {
    const match = matchCatalogoPorNome(l.nome, catalogo);
    if (match.status === 'nao_encontrado' || !match.item) {
      return { ...l, status: 'nao_encontrado' as const };
    }
    return {
      ...l,
      status: match.status,
      estoqueInsumoId: match.item.id,
      estoqueNome: match.item.nome,
      score: match.score,
    };
  });
}

export type ConfirmSaldoItem = {
  estoqueInsumoId: string;
  qtdFinal: number;
  custoMedio: number | null;
};

/**
 * Grava CmvSaldoEstoque com origem IMPORTACAO.
 * Esse saldo vira estoque inicial do mês seguinte.
 */
export async function confirmarSaldo(params: {
  tenantUserId: string;
  storeSlug: string;
  competencia: string;
  itens: ConfirmSaldoItem[];
}): Promise<{ upserted: number }> {
  let upserted = 0;
  for (const it of params.itens) {
    if (!it.estoqueInsumoId) continue;
    await prisma.cmvSaldoEstoque.upsert({
      where: {
        userId_storeSlug_competencia_estoqueInsumoId: {
          userId: params.tenantUserId,
          storeSlug: params.storeSlug,
          competencia: params.competencia,
          estoqueInsumoId: it.estoqueInsumoId,
        },
      },
      create: {
        userId: params.tenantUserId,
        storeSlug: params.storeSlug,
        competencia: params.competencia,
        estoqueInsumoId: it.estoqueInsumoId,
        qtdFinal: it.qtdFinal,
        custoMedio: it.custoMedio,
        origem: 'IMPORTACAO',
      },
      update: {
        qtdFinal: it.qtdFinal,
        custoMedio: it.custoMedio,
        origem: 'IMPORTACAO',
      },
    });
    upserted++;
  }
  return { upserted };
}

export { listarAbas, normalizarDescricao };
