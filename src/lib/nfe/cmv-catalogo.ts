/**
 * Catálogo CMV Real (CmvRealInsumoConfig): ensure, órfãos e marcação na importação.
 */

import type { CmvRealSecao, CmvRealUnidade } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export type OrfaoCmvCatalogo = {
  estoqueInsumoId: string;
  nome: string;
  unidade: CmvRealUnidade;
  secaoSugerida: CmvRealSecao;
  lojas: string[];
  qtdSaldoPorLoja: Record<string, number>;
  comprasValorPorLoja: Record<string, number>;
  comprasValor: number;
};

export function secaoFromCategoriaId(
  categoriaId: string | null | undefined,
): CmvRealSecao {
  const id = String(categoriaId || '').toLowerCase();
  if (id.includes('embalag')) return 'EMBALAGEM';
  if (id.includes('bebid')) return 'BEBIDA';
  return 'MATERIA_PRIMA';
}

export function secaoFromNomeProduto(nome: string): CmvRealSecao {
  const n = String(nome || '').toUpperCase();
  if (
    /EMBALAGEM|MESINHA|SEPARADOR|SACOLA|POTE|COPO|TAMPA|PAPEL|FILME/.test(n)
  ) {
    return 'EMBALAGEM';
  }
  if (
    /COCA|PEPSI|GUARAN|SPRITE|SUCO|AGUA|REFRIG|CERVEJ|HEINEKEN|SPATEN|BEBIDA|SCHIN|FANTA/.test(
      n
    )
  ) {
    return 'BEBIDA';
  }
  return 'MATERIA_PRIMA';
}

export function unidadeFromEstoque(unidade: string | null | undefined): CmvRealUnidade {
  return String(unidade || '').toLowerCase() === 'un' ? 'UN' : 'KG';
}

/**
 * Garante config ativo. Retorna true se criou (ou reativou).
 */
export async function ensureCmvRealInsumoConfig(params: {
  tenantUserId: string;
  estoqueInsumoId: string;
  secao: CmvRealSecao;
  unidade: CmvRealUnidade;
  ordem?: number;
}): Promise<{ created: boolean }> {
  const existing = await prisma.cmvRealInsumoConfig.findUnique({
    where: {
      userId_estoqueInsumoId: {
        userId: params.tenantUserId,
        estoqueInsumoId: params.estoqueInsumoId,
      },
    },
  });

  if (existing) {
    if (!existing.ativo) {
      await prisma.cmvRealInsumoConfig.update({
        where: { id: existing.id },
        data: {
          ativo: true,
          secao: params.secao,
          unidade: params.unidade,
          ...(params.ordem != null ? { ordem: params.ordem } : {}),
        },
      });
      return { created: true };
    }
    return { created: false };
  }

  let ordem = params.ordem;
  if (ordem == null) {
    const max = await prisma.cmvRealInsumoConfig.aggregate({
      where: { userId: params.tenantUserId, secao: params.secao },
      _max: { ordem: true },
    });
    ordem = (max._max.ordem ?? 0) + 1;
  }

  await prisma.cmvRealInsumoConfig.create({
    data: {
      userId: params.tenantUserId,
      estoqueInsumoId: params.estoqueInsumoId,
      secao: params.secao,
      unidade: params.unidade,
      ordem,
      ativo: true,
    },
  });
  return { created: true };
}

/** IDs com config ativo no tenant. */
export async function idsNoCatalogoCmv(
  tenantUserId: string,
): Promise<Set<string>> {
  const rows = await prisma.cmvRealInsumoConfig.findMany({
    where: { userId: tenantUserId, ativo: true },
    select: { estoqueInsumoId: true },
  });
  return new Set(rows.map((r) => r.estoqueInsumoId));
}

/**
 * Produtos com saldo (competência) ou compras (competências) fora do catálogo CMV ativo.
 */
export async function listarOrfaosCmvCatalogo(params: {
  tenantUserId: string;
  competenciaSaldo?: string;
  competenciasCompras?: string[];
}): Promise<OrfaoCmvCatalogo[]> {
  const competenciaSaldo = params.competenciaSaldo || '2026-09';
  const competenciasCompras =
    params.competenciasCompras || [competenciaSaldo];

  const inCfg = await idsNoCatalogoCmv(params.tenantUserId);

  const [saldos, lancs] = await Promise.all([
    prisma.cmvSaldoEstoque.findMany({
      where: {
        userId: params.tenantUserId,
        competencia: competenciaSaldo,
      },
      select: {
        estoqueInsumoId: true,
        storeSlug: true,
        qtdFinal: true,
      },
    }),
    prisma.cmvLancamento.findMany({
      where: {
        userId: params.tenantUserId,
        competencia: { in: competenciasCompras },
        tipo: { in: ['COMPRA_NFE', 'COMPRA_MANUAL'] },
      },
      select: {
        estoqueInsumoId: true,
        storeSlug: true,
        valorTotal: true,
      },
    }),
  ]);

  const orphanIds = new Set<string>();
  for (const s of saldos) {
    if (!inCfg.has(s.estoqueInsumoId)) orphanIds.add(s.estoqueInsumoId);
  }
  for (const l of lancs) {
    if (!inCfg.has(l.estoqueInsumoId)) orphanIds.add(l.estoqueInsumoId);
  }
  if (orphanIds.size === 0) return [];

  const insumos = await prisma.estoqueInsumo.findMany({
    where: { id: { in: [...orphanIds] } },
    select: { id: true, nome: true, unidade: true, categoriaId: true },
  });
  const byId = new Map(insumos.map((i) => [i.id, i]));

  const out: OrfaoCmvCatalogo[] = [];
  for (const id of orphanIds) {
    const ins = byId.get(id);
    const saldosI = saldos.filter((s) => s.estoqueInsumoId === id);
    const lancsI = lancs.filter((l) => l.estoqueInsumoId === id);
    const lojas = [
      ...new Set([
        ...saldosI.map((s) => s.storeSlug),
        ...lancsI.map((l) => l.storeSlug),
      ]),
    ].sort();
    const qtdSaldoPorLoja: Record<string, number> = {};
    for (const s of saldosI) {
      qtdSaldoPorLoja[s.storeSlug] = Number(s.qtdFinal);
    }
    const comprasValorPorLoja: Record<string, number> = {};
    for (const l of lancsI) {
      comprasValorPorLoja[l.storeSlug] =
        (comprasValorPorLoja[l.storeSlug] ?? 0) + Number(l.valorTotal);
    }
    const secaoPorNome = secaoFromNomeProduto(ins?.nome || '');
    const secaoFinal =
      secaoPorNome !== 'MATERIA_PRIMA'
        ? secaoPorNome
        : secaoFromCategoriaId(ins?.categoriaId);

    out.push({
      estoqueInsumoId: id,
      nome: ins?.nome || id,
      unidade: unidadeFromEstoque(ins?.unidade),
      secaoSugerida: secaoFinal,
      lojas,
      qtdSaldoPorLoja,
      comprasValorPorLoja,
      comprasValor: lancsI.reduce((a, l) => a + Number(l.valorTotal), 0),
    });
  }

  out.sort((a, b) => {
    if (a.secaoSugerida !== b.secaoSugerida) {
      return a.secaoSugerida.localeCompare(b.secaoSugerida);
    }
    return a.nome.localeCompare(b.nome, 'pt-BR');
  });
  return out;
}

export async function incluirOrfaosNoCatalogoCmv(params: {
  tenantUserId: string;
  itens: Array<{
    estoqueInsumoId: string;
    secao: CmvRealSecao;
    unidade?: CmvRealUnidade;
  }>;
}): Promise<{ incluidos: number }> {
  let incluidos = 0;
  for (const it of params.itens) {
    const insumo = await prisma.estoqueInsumo.findUnique({
      where: { id: it.estoqueInsumoId },
      select: { unidade: true },
    });
    const { created } = await ensureCmvRealInsumoConfig({
      tenantUserId: params.tenantUserId,
      estoqueInsumoId: it.estoqueInsumoId,
      secao: it.secao,
      unidade: it.unidade ?? unidadeFromEstoque(insumo?.unidade),
    });
    if (created) incluidos += 1;
  }
  return { incluidos };
}
