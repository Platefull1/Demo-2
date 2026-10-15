/**
 * Detecção compartilhada de seções/produtos na planilha CMV DESPERDÍCIO.
 * Usado por importar-catalogo e importar-saldo.
 *
 * Âncora: coluna B exatamente "MATERIA PRIMA" | "EMBALAGENS" | "BEBIDAS"
 * (normalizado) E coluna D = "ESTOQUE INICIAL" na mesma linha.
 * Produto: B preenchido + E (unidade) preenchido, dentro da seção.
 */

import * as XLSX from 'xlsx';

export type CmvRealSecao = 'MATERIA_PRIMA' | 'EMBALAGEM' | 'BEBIDA';

export const COL_PRODUTO = 1; // B
export const COL_ESTOQUE_INICIAL_HDR = 3; // D
export const COL_UNIDADE = 4; // E

const ANCHOR_EXACT: Record<string, CmvRealSecao> = {
  'MATERIA PRIMA': 'MATERIA_PRIMA',
  EMBALAGENS: 'EMBALAGEM',
  BEBIDAS: 'BEBIDA',
};

/** Normaliza texto de âncora/cabeçalho: sem acento, maiúsculo, espaços colapsados. */
export function normalizarCelulaSecao(raw: string): string {
  return String(raw || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function cellStr(ws: XLSX.WorkSheet, r: number, c: number): string {
  const ref = XLSX.utils.encode_cell({ r, c });
  const cell = ws[ref] as XLSX.CellObject | undefined;
  if (!cell) return '';
  if (cell.w != null && String(cell.w).trim()) return String(cell.w).trim();
  if (cell.v != null) return String(cell.v).trim();
  return '';
}

/** B exatamente MATERIA PRIMA / EMBALAGENS / BEBIDAS (após normalizar). */
export function secaoFromNomeExato(nomeB: string): CmvRealSecao | null {
  return ANCHOR_EXACT[normalizarCelulaSecao(nomeB)] ?? null;
}

export function isCabecalhoEstoqueInicial(colD: string): boolean {
  return normalizarCelulaSecao(colD) === 'ESTOQUE INICIAL';
}

/**
 * Âncora de seção: B exato + D = "ESTOQUE INICIAL".
 * Produtos como "EMBALAGEM 20" nunca batem (não são exatamente EMBALAGENS).
 */
export function detectarAncoraSecao(
  ws: XLSX.WorkSheet,
  r: number,
): CmvRealSecao | null {
  const nomeB = cellStr(ws, r, COL_PRODUTO);
  const secao = secaoFromNomeExato(nomeB);
  if (!secao) return null;
  const colD = cellStr(ws, r, COL_ESTOQUE_INICIAL_HDR);
  if (!isCabecalhoEstoqueInicial(colD)) return null;
  return secao;
}

/** Fim do bloco de inventário (resumo). */
export function isFimBlocoInventario(nomeB: string): boolean {
  return /^(cmv\b|venda\b|resumo)\b/i.test(nomeB.trim());
}

export function isLinhaTotal(nomeB: string): boolean {
  return /^(total|soma)\b/i.test(nomeB.trim());
}

/**
 * Linha de produto candidata: B + E preenchidos.
 * Não inclui âncoras exatas nem totais/CMV.
 */
export function lerLinhaProduto(
  ws: XLSX.WorkSheet,
  r: number,
): { nome: string; unidadeRaw: string } | null {
  const nomeB = cellStr(ws, r, COL_PRODUTO);
  if (!nomeB || nomeB.length < 2) return null;
  if (isFimBlocoInventario(nomeB) || isLinhaTotal(nomeB)) return null;
  // Nome exato de seção sem ser âncora completa → não é produto
  if (secaoFromNomeExato(nomeB)) return null;

  const unidadeRaw = cellStr(ws, r, COL_UNIDADE);
  if (!unidadeRaw.trim()) return null;

  return { nome: nomeB, unidadeRaw };
}
