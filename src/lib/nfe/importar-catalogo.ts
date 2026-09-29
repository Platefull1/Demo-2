/**
 * Importador do catálogo CMV Real a partir da planilha "CMV DESPERDÍCIO".
 * Fase antecipada: só CmvRealInsumoConfig (seção, unidade, ordem).
 * CmvSaldoEstoque fica para a Fase 4.
 *
 * Layout: colunas B=produto, E=unidade; seções por âncoras na coluna B.
 */

import * as XLSX from 'xlsx';
import { prisma } from '@/lib/prisma';
import {
  loadCatalogoEstoqueFromSession,
  matchCatalogoPorNome,
  type EstoqueCatalogoItem,
} from '@/lib/estoque/catalogo';
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
  kgPorUnidade?: number | null;
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

export function previewCatalogoComCatalogo(
  linhas: LinhaCatalogoPlanilha[],
  catalogoItens: EstoqueCatalogoItem[],
): PreviewCatalogoItem[] {
  return linhas.map((l) => {
    const match = matchCatalogoPorNome(l.nome, catalogoItens);
    if (match.status === 'nao_encontrado' || !match.item) {
      return {
        linha: l.linha,
        nome: l.nome,
        secao: l.secao,
        unidade: l.unidade,
        ordem: l.ordem,
        status: 'nao_encontrado' as const,
      };
    }
    return {
      linha: l.linha,
      nome: l.nome,
      secao: l.secao,
      unidade: l.unidade,
      ordem: l.ordem,
      status: match.status,
      estoqueInsumoId: match.item.id,
      estoqueNome: match.item.nome,
      score: match.score,
      kgPorUnidade: match.item.kgPorUnidade,
    };
  });
}

/** @deprecated prefira previewCatalogoComCatalogo + loadCatalogoEstoqueForUserId(tenant) */
export async function previewCatalogo(
  _ignored: string,
  linhas: LinhaCatalogoPlanilha[],
): Promise<PreviewCatalogoItem[]> {
  const catalogo = await loadCatalogoEstoqueFromSession();
  if (!catalogo) throw new Error('Sessão sem contexto de Estoque (tenant RH).');
  return previewCatalogoComCatalogo(linhas, catalogo.itens);
}

export interface ConfirmCatalogoItem {
  nome: string;
  secao: CmvRealSecao;
  unidade: CmvRealUnidade;
  ordem: number;
  estoqueInsumoId: string;
}

/**
 * Cria/atualiza CmvRealInsumoConfig no tenantUserId informado (dono do grupo).
 */
export async function confirmarCatalogo(
  tenantUserId: string,
  itens: ConfirmCatalogoItem[],
): Promise<{ upserted: number; tenantUserId: string }> {
  let upserted = 0;
  for (const it of itens) {
    if (!it.estoqueInsumoId) continue;
    await prisma.cmvRealInsumoConfig.upsert({
      where: {
        userId_estoqueInsumoId: {
          userId: tenantUserId,
          estoqueInsumoId: it.estoqueInsumoId,
        },
      },
      create: {
        userId: tenantUserId,
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
  return { upserted, tenantUserId };
}

/** Cria EstoqueInsumo no tenant + CmvRealInsumoConfig. */
export async function criarInsumoEConfig(
  tenantUserId: string,
  opts: {
    nome: string;
    secao: CmvRealSecao;
    unidade: CmvRealUnidade;
    ordem: number;
  },
): Promise<{ estoqueInsumoId: string; tenantUserId: string }> {
  const slugBase = normalizarDescricao(opts.nome)
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .slice(0, 60);
  let slug = slugBase || `insumo-${Date.now()}`;
  const exists = await prisma.estoqueInsumo.findUnique({
    where: { userId_insumoId: { userId: tenantUserId, insumoId: slug } },
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
      userId: tenantUserId,
      insumoId: slug,
      nome: opts.nome.trim().toUpperCase(),
      unidade: opts.unidade === 'KG' ? 'kg' : 'un',
      categoriaId: cat.id,
      categoriaNome: cat.nome,
      categoriaIcone: cat.icone,
    },
  });

  await prisma.cmvRealInsumoConfig.create({
    data: {
      userId: tenantUserId,
      estoqueInsumoId: insumo.id,
      secao: opts.secao,
      unidade: opts.unidade,
      ordem: opts.ordem,
      ativo: true,
    },
  });

  return { estoqueInsumoId: insumo.id, tenantUserId };
}

export type { EstoqueCatalogoItem };
