/**
 * Estoque final a partir de EstoqueContagem dos membros do grupo.
 * sessoes = StockCategory[] (ver app/estoque/types.ts):
 *   { id, nome, icone, status, itens: [{ insumoId (slug), nome, unidade,
 *     quantidadeContada, modoContagem?, kgPorUnidade? }] }
 */

import { prisma } from '@/lib/prisma';
import { storeSlugFromLojaNome, type CmvStoreSlug } from './lojas';

export type ContagemItemExtraido = {
  insumoSlug: string;
  nome: string;
  /** Quantidade em KG (ou UN se produto CMV for UN sem conversão) */
  qtdKg: number;
  modoContagem: 'kg' | 'unidade' | null;
  kgPorUnidade: number | null;
  convertidaDeUnidade: boolean;
};

export type ContagemResumo = {
  id: string;
  userId: string;
  lojaNome: string | null;
  storeSlug: CmvStoreSlug | null;
  /** true se lojaNome não casou com slug conhecido */
  lojaNaoIdentificada: boolean;
  dataCriacao: Date;
  updatedAt: Date;
  itens: ContagemItemExtraido[];
};

type StockItemJson = {
  insumoId?: string;
  nome?: string;
  unidade?: string;
  quantidadeContada?: number | null;
  modoContagem?: 'kg' | 'unidade';
  kgPorUnidade?: number | null;
};

type StockCategoryJson = {
  id?: string;
  nome?: string;
  status?: string;
  itens?: StockItemJson[];
};

function asCategories(raw: unknown): StockCategoryJson[] {
  if (!Array.isArray(raw)) return [];
  return raw as StockCategoryJson[];
}

/**
 * Converte quantidade contada para kg conforme regra CMV.
 * No app de estoque, com kgPorUnidade a qtd já costuma estar em kg;
 * se modoContagem=unidade e só temos kgPorUnidade do config (sem no item),
 * multiplica. Se puro unidade (sem fator), mantém como UN.
 */
export function qtdContagemParaKg(
  qtd: number,
  opts: {
    modoContagem?: 'kg' | 'unidade' | null;
    kgPorUnidadeItem?: number | null;
    kgPorUnidadeConfig?: number | null;
  },
): { qtdKg: number; convertidaDeUnidade: boolean; kgPorUnidade: number | null } {
  const modo = opts.modoContagem ?? 'kg';
  const kgItem = opts.kgPorUnidadeItem;
  const kgCfg = opts.kgPorUnidadeConfig;
  const kg = kgItem ?? kgCfg ?? null;

  if (modo !== 'unidade') {
    return { qtdKg: qtd, convertidaDeUnidade: false, kgPorUnidade: kg };
  }

  // App já gravou em kg quando tinha fator no item
  if (kgItem != null && kgItem > 0) {
    return { qtdKg: qtd, convertidaDeUnidade: false, kgPorUnidade: kgItem };
  }

  // Só config: assume digitado em unidade → converter
  if (kgCfg != null && kgCfg > 0) {
    return {
      qtdKg: Math.round(qtd * kgCfg * 10000) / 10000,
      convertidaDeUnidade: true,
      kgPorUnidade: kgCfg,
    };
  }

  return { qtdKg: qtd, convertidaDeUnidade: false, kgPorUnidade: null };
}

/**
 * Busca contagens CONCLUÍDAS de qualquer userId do grupo (membros + dono).
 */
export async function listarContagensConcluidasGrupo(params: {
  memberUserIds: string[];
  storeSlug?: string | null;
}): Promise<ContagemResumo[]> {
  const contagens = await prisma.estoqueContagem.findMany({
    where: {
      userId: { in: params.memberUserIds },
      status: 'concluida',
    },
    orderBy: { updatedAt: 'desc' },
    take: 200,
  });

  // kgPorUnidade por (userId, produtoId=slug) nos configs dos membros
  const configs = await prisma.estoqueProdutoConfig.findMany({
    where: { userId: { in: params.memberUserIds } },
    select: { userId: true, produtoId: true, kgPorUnidade: true, modoContagem: true },
  });
  const cfgKey = (uid: string, slug: string) => `${uid}::${slug}`;
  const cfgMap = new Map(
    configs.map((c) => [
      cfgKey(c.userId, c.produtoId),
      {
        kgPorUnidade: c.kgPorUnidade,
        modoContagem: c.modoContagem as 'kg' | 'unidade',
      },
    ]),
  );

  const out: ContagemResumo[] = [];
  for (const c of contagens) {
    const slug = storeSlugFromLojaNome(c.lojaNome);
    if (params.storeSlug && slug && slug !== params.storeSlug) continue;
    if (params.storeSlug && !slug) {
      // loja não identificada: ainda listar para o usuário escolher
    }

    const cats = asCategories(c.sessoes);
    const itens: ContagemItemExtraido[] = [];
    for (const cat of cats) {
      for (const it of cat.itens ?? []) {
        if (!it.insumoId) continue;
        if (it.quantidadeContada == null) continue;
        const cfg = cfgMap.get(cfgKey(c.userId, it.insumoId));
        const modo =
          it.modoContagem ?? cfg?.modoContagem ?? ('kg' as const);
        const conv = qtdContagemParaKg(Number(it.quantidadeContada), {
          modoContagem: modo,
          kgPorUnidadeItem: it.kgPorUnidade ?? null,
          kgPorUnidadeConfig: cfg?.kgPorUnidade ?? null,
        });
        itens.push({
          insumoSlug: it.insumoId,
          nome: it.nome || it.insumoId,
          qtdKg: conv.qtdKg,
          modoContagem: modo,
          kgPorUnidade: conv.kgPorUnidade,
          convertidaDeUnidade: conv.convertidaDeUnidade,
        });
      }
    }

    out.push({
      id: c.id,
      userId: c.userId,
      lojaNome: c.lojaNome,
      storeSlug: slug,
      lojaNaoIdentificada: slug == null,
      dataCriacao: c.dataCriacao,
      updatedAt: c.updatedAt,
      itens,
    });
  }

  return out;
}

/**
 * Aplica contagem → CmvSaldoEstoque (origem CONTAGEM) no tenant dono.
 * Casa itens pelo slug (EstoqueInsumo.insumoId) do catálogo do tenant.
 */
export async function aplicarContagemComoSaldo(params: {
  tenantUserId: string;
  storeSlug: string;
  competencia: string;
  contagem: ContagemResumo;
}): Promise<{ gravados: number; semCatalogo: string[] }> {
  const insumos = await prisma.estoqueInsumo.findMany({
    where: { userId: params.tenantUserId },
    select: { id: true, insumoId: true },
  });
  const bySlug = new Map(insumos.map((i) => [i.insumoId, i.id]));

  const configs = await prisma.cmvRealInsumoConfig.findMany({
    where: { userId: params.tenantUserId, ativo: true },
    select: { estoqueInsumoId: true },
  });
  const ativos = new Set(configs.map((c) => c.estoqueInsumoId));

  let gravados = 0;
  const semCatalogo: string[] = [];

  for (const it of params.contagem.itens) {
    const estoqueInsumoId = bySlug.get(it.insumoSlug);
    if (!estoqueInsumoId || !ativos.has(estoqueInsumoId)) {
      semCatalogo.push(it.insumoSlug);
      continue;
    }
    await prisma.cmvSaldoEstoque.upsert({
      where: {
        userId_storeSlug_competencia_estoqueInsumoId: {
          userId: params.tenantUserId,
          storeSlug: params.storeSlug,
          competencia: params.competencia,
          estoqueInsumoId,
        },
      },
      create: {
        userId: params.tenantUserId,
        storeSlug: params.storeSlug,
        competencia: params.competencia,
        estoqueInsumoId,
        qtdFinal: it.qtdKg,
        custoMedio: null,
        origem: 'CONTAGEM',
      },
      update: {
        qtdFinal: it.qtdKg,
        origem: 'CONTAGEM',
      },
    });
    gravados++;
  }

  await prisma.cmvFechamento.upsert({
    where: {
      userId_storeSlug_competencia: {
        userId: params.tenantUserId,
        storeSlug: params.storeSlug,
        competencia: params.competencia,
      },
    },
    create: {
      userId: params.tenantUserId,
      storeSlug: params.storeSlug,
      competencia: params.competencia,
      status: 'ABERTO',
      contagemId: params.contagem.id,
      ajustes: [],
      refeicoesFuncionarios: [],
    },
    update: { contagemId: params.contagem.id },
  });

  return { gravados, semCatalogo };
}
