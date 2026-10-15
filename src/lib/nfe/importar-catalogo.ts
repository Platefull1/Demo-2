/**
 * Importador do catálogo CMV Real a partir da planilha "CMV DESPERDÍCIO".
 * Parser puro: importar-catalogo-parse.ts
 */

import { prisma } from '@/lib/prisma';
import {
  loadCatalogoEstoqueFromSession,
  matchCatalogoPorNome,
  type EstoqueCatalogoItem,
} from '@/lib/estoque/catalogo';
import type { CmvRealSecao } from './importar-planilha-secoes';
import {
  lerCatalogoDoBuffer,
  listarAbas,
  parseCatalogoDaAba,
  type CmvRealUnidade,
  type LinhaCatalogoPlanilha,
} from './importar-catalogo-parse';
import { normalizarDescricao } from './normalize';

export type { CmvRealSecao, CmvRealUnidade, LinhaCatalogoPlanilha };
export { lerCatalogoDoBuffer, listarAbas, parseCatalogoDaAba };

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
