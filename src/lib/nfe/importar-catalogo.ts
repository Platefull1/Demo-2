/**
 * Importador do catálogo CMV Real a partir da planilha "CMV DESPERDÍCIO".
 * Fase antecipada: só CmvRealInsumoConfig (seção, unidade, ordem).
 * CmvSaldoEstoque fica para a Fase 4.
 *
 * Layout: colunas B=produto, E=unidade; seções por âncoras na coluna B.
 */

import * as XLSX from 'xlsx';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { normalizarDescricao } from './normalize';

export type CmvRealSecao = 'MATERIA_PRIMA' | 'EMBALAGEM' | 'BEBIDA';
export type CmvRealUnidade = 'KG' | 'UN';

export interface LinhaCatalogoPlanilha {
  linha: number;
  nome: string;
  nomeNormalizado: string;
  secao: CmvRealSecao;
  unidade: CmvRealUnidade;
  ordem: number;
}

export interface PreviewCatalogoItem {
  linha: number;
  nome: string;
  secao: CmvRealSecao;
  unidade: CmvRealUnidade;
  ordem: number;
  status: 'casado' | 'sugerido' | 'nao_encontrado';
  estoqueInsumoId?: string;
  estoqueNome?: string;
  score?: number;
}

const SECAO_ANCHORS: Array<{ re: RegExp; secao: CmvRealSecao }> = [
  { re: /^MAT[EÉ]RIA[\s\-]*PRIMA/i, secao: 'MATERIA_PRIMA' },
  { re: /^EMBALAG/i, secao: 'EMBALAGEM' },
  { re: /^BEBID/i, secao: 'BEBIDA' },
];

function cellStr(ws: XLSX.WorkSheet, r: number, c: number): string {
  const ref = XLSX.utils.encode_cell({ r, c });
  const cell = ws[ref] as XLSX.CellObject | undefined;
  if (!cell) return '';
  // Preferir valor em cache (não fórmula)
  if (cell.w != null && String(cell.w).trim()) return String(cell.w).trim();
  if (cell.v != null) return String(cell.v).trim();
  return '';
}

function unidadeFromCol(raw: string, secao: CmvRealSecao): CmvRealUnidade {
  const u = raw.toUpperCase().replace(/[^A-Z]/g, '');
  if (u === 'KG' || u === 'KILO' || u === 'KILOS') return 'KG';
  if (u === 'UN' || u === 'UND' || u === 'UNID' || u === 'PC') return 'UN';
  return secao === 'MATERIA_PRIMA' ? 'KG' : 'UN';
}

function similaridadeSimples(a: string, b: string): number {
  const na = normalizarDescricao(a);
  const nb = normalizarDescricao(b);
  if (!na || !nb) return 0;
  if (na === nb) return 1;
  if (na.includes(nb) || nb.includes(na)) {
    return Math.min(na.length, nb.length) / Math.max(na.length, nb.length);
  }
  // overlap de tokens
  const ta = new Set(na.split(' ').filter((t) => t.length > 2));
  const tb = new Set(nb.split(' ').filter((t) => t.length > 2));
  if (ta.size === 0 || tb.size === 0) return 0;
  let inter = 0;
  for (const t of ta) if (tb.has(t)) inter++;
  return inter / Math.max(ta.size, tb.size);
}

/**
 * Lê linhas de produto da aba mensal (valores em cache).
 */
export function parseCatalogoDaAba(ws: XLSX.WorkSheet): LinhaCatalogoPlanilha[] {
  const ref = ws['!ref'];
  if (!ref) return [];
  const range = XLSX.utils.decode_range(ref);
  const out: LinhaCatalogoPlanilha[] = [];
  let secaoAtual: CmvRealSecao | null = null;
  let ordem = 0;

  for (let r = range.s.r; r <= range.e.r; r++) {
    const nomeB = cellStr(ws, r, 1); // coluna B
    if (!nomeB) continue;

    const anchor = SECAO_ANCHORS.find((a) => a.re.test(nomeB));
    if (anchor) {
      secaoAtual = anchor.secao;
      ordem = 0;
      continue;
    }

    if (!secaoAtual) continue;

    // Pular totais / linhas vazias de estrutura
    if (/^(total|soma|cmv|venda)/i.test(nomeB)) continue;
    if (nomeB.length < 2) continue;

    const undE = cellStr(ws, r, 4); // coluna E
    ordem += 1;
    out.push({
      linha: r + 1,
      nome: nomeB,
      nomeNormalizado: normalizarDescricao(nomeB),
      secao: secaoAtual,
      unidade: unidadeFromCol(undE, secaoAtual),
      ordem,
    });
  }

  return out;
}

export function listarAbas(buffer: ArrayBuffer): string[] {
  const wb = XLSX.read(buffer, { type: 'array', cellDates: true });
  return wb.SheetNames;
}

export function lerCatalogoDoBuffer(
  buffer: ArrayBuffer,
  abaNome: string,
): LinhaCatalogoPlanilha[] {
  const wb = XLSX.read(buffer, { type: 'array', cellDates: true });
  const ws = wb.Sheets[abaNome];
  if (!ws) throw new Error(`Aba "${abaNome}" não encontrada`);
  return parseCatalogoDaAba(ws);
}

export async function previewCatalogo(
  userId: string,
  linhas: LinhaCatalogoPlanilha[],
): Promise<PreviewCatalogoItem[]> {
  const insumos = await prisma.estoqueInsumo.findMany({
    where: { userId },
    select: { id: true, nome: true, insumoId: true },
  });

  return linhas.map((l) => {
    let best: { id: string; nome: string; score: number } | null = null;
    for (const ins of insumos) {
      const score = similaridadeSimples(l.nome, ins.nome);
      if (score < 0.55) continue;
      if (!best || score > best.score) {
        best = { id: ins.id, nome: ins.nome, score };
      }
    }

    if (best && best.score >= 0.95) {
      return {
        linha: l.linha,
        nome: l.nome,
        secao: l.secao,
        unidade: l.unidade,
        ordem: l.ordem,
        status: 'casado' as const,
        estoqueInsumoId: best.id,
        estoqueNome: best.nome,
        score: best.score,
      };
    }
    if (best && best.score >= 0.55) {
      return {
        linha: l.linha,
        nome: l.nome,
        secao: l.secao,
        unidade: l.unidade,
        ordem: l.ordem,
        status: 'sugerido' as const,
        estoqueInsumoId: best.id,
        estoqueNome: best.nome,
        score: best.score,
      };
    }
    return {
      linha: l.linha,
      nome: l.nome,
      secao: l.secao,
      unidade: l.unidade,
      ordem: l.ordem,
      status: 'nao_encontrado' as const,
    };
  });
}

export interface ConfirmCatalogoItem {
  nome: string;
  secao: CmvRealSecao;
  unidade: CmvRealUnidade;
  ordem: number;
  estoqueInsumoId: string;
}

/**
 * Cria/atualiza CmvRealInsumoConfig. Não grava saldo.
 */
export async function confirmarCatalogo(
  userId: string,
  itens: ConfirmCatalogoItem[],
): Promise<{ upserted: number }> {
  let upserted = 0;
  for (const it of itens) {
    if (!it.estoqueInsumoId) continue;
    await prisma.cmvRealInsumoConfig.upsert({
      where: {
        userId_estoqueInsumoId: {
          userId,
          estoqueInsumoId: it.estoqueInsumoId,
        },
      },
      create: {
        userId,
        estoqueInsumoId: it.estoqueInsumoId,
        secao: it.secao,
        unidade: it.unidade,
        ordem: it.ordem,
        ativo: true,
      },
      update: {
        secao: it.secao,
        unidade: it.unidade,
        ordem: it.ordem,
        ativo: true,
      },
    });
    upserted++;
  }
  return { upserted };
}

/** Cria EstoqueInsumo mínimo + config (quando produto não existe). */
export async function criarInsumoEConfig(
  userId: string,
  opts: {
    nome: string;
    secao: CmvRealSecao;
    unidade: CmvRealUnidade;
    ordem: number;
  },
): Promise<{ estoqueInsumoId: string }> {
  const slugBase = normalizarDescricao(opts.nome)
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .slice(0, 60);
  let slug = slugBase || `insumo-${Date.now()}`;
  const exists = await prisma.estoqueInsumo.findUnique({
    where: { userId_insumoId: { userId, insumoId: slug } },
  });
  if (exists) slug = `${slug}-${Date.now().toString(36)}`;

  const cat =
    opts.secao === 'MATERIA_PRIMA'
      ? { id: 'materias-primas', nome: 'Matérias-primas', icone: '🌾' }
      : opts.secao === 'EMBALAGEM'
        ? { id: 'embalagens', nome: 'Embalagens', icone: '📦' }
        : { id: 'bebidas', nome: 'Bebidas', icone: '🥤' };

  const insumo = await prisma.estoqueInsumo.create({
    data: {
      userId,
      insumoId: slug,
      nome: opts.nome,
      unidade: opts.unidade === 'KG' ? 'kg' : 'un',
      categoriaId: cat.id,
      categoriaNome: cat.nome,
      categoriaIcone: cat.icone,
    },
  });

  await prisma.cmvRealInsumoConfig.create({
    data: {
      userId,
      estoqueInsumoId: insumo.id,
      secao: opts.secao,
      unidade: opts.unidade,
      ordem: opts.ordem,
      ativo: true,
    },
  });

  return { estoqueInsumoId: insumo.id };
}
