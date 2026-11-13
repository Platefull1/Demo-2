import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import {
  fetchSalesForCompetencia,
  type SaiposStoreSlug,
} from '@/lib/saipos/dataApi';
import {
  classificarRefeicao,
  parseRefeicaoRegras,
  type SaiposSaleLike,
} from '@/lib/cmv-real/refeicoes';
import {
  buildVendaMesDetalhe,
  calcularVendaLiquida,
  parseVendaMesDetalhe,
  resolveVendaLiquidaConfig,
  vendaMesEfetiva,
  type SaiposSaleVendaLike,
  type VendaMesDetalhe,
} from '@/lib/cmv-real/venda-liquida';
import { notificarFormasPagamentoDesconhecidas } from '@/lib/nfe/notificar';

function decimal(n: number): Prisma.Decimal {
  return new Prisma.Decimal(n);
}

function asSlug(storeSlug: string): SaiposStoreSlug {
  const s = storeSlug as SaiposStoreSlug;
  if (!['ahu', 'pilarzinho', 'portao', 'uberaba'].includes(s)) {
    throw new Error(`Loja inválida para API de Dados: ${storeSlug}`);
  }
  return s;
}

/**
 * Sync manual (botão CMV Real) e automático (n8n → /api/cmv/vendas/sync-auto).
 * Venda líquida + refeições; preserva ajusteVenda no upsert.
 */
export async function syncRefeicoesSaipos(params: {
  tenantUserId: string;
  storeSlug: string;
  competencia: string;
  /** Actor para WhatsApp (formas desconhecidas). Default = tenant. */
  actorUserId?: string;
  /** Se false, não grava vendaMes/detalhe no fechamento (só refeições). Default true. */
  persistVenda?: boolean;
}): Promise<{
  upserted: number;
  removedOrIgnored: number;
  vendaMesSaipos: number;
  totalSalesFetched: number;
  vendaMesDetalhe: VendaMesDetalhe;
  formasDesconhecidas: string[];
}> {
  const fechamento = await prisma.cmvFechamento.findUnique({
    where: {
      userId_storeSlug_competencia: {
        userId: params.tenantUserId,
        storeSlug: params.storeSlug,
        competencia: params.competencia,
      },
    },
  });
  if (fechamento?.status === 'FECHADO') {
    throw new Error('Competência fechada — sync de refeições bloqueado.');
  }

  const config = await prisma.nfeConfig.findUnique({
    where: { userId: params.tenantUserId },
  });
  const regras = parseRefeicaoRegras(config?.refeicaoRegras);
  const vendaCfg = resolveVendaLiquidaConfig(
    config?.vendaMesConfig,
    process.env.CMV_LIMITE_TAXA_ENTREGA,
  );

  const sales = (await fetchSalesForCompetencia({
    storeSlug: asSlug(params.storeSlug),
    competencia: params.competencia,
  })) as SaiposSaleLike[];

  const calc = calcularVendaLiquida(sales as SaiposSaleVendaLike[], vendaCfg);
  const prevDetalhe = parseVendaMesDetalhe(fechamento?.vendaMesDetalhe);
  const detalhe = buildVendaMesDetalhe(calc, prevDetalhe?.ajusteVenda ?? null);
  const vendaMesSaipos = vendaMesEfetiva(detalhe) ?? detalhe.vendaLiquida;

  const seenIds = new Set<string>();
  let upserted = 0;

  for (const sale of sales) {
    const cls = classificarRefeicao(sale, regras);
    if (!cls) continue;

    seenIds.add(cls.saiposSaleId);
    await prisma.cmvRefeicao.upsert({
      where: {
        userId_storeSlug_saiposSaleId: {
          userId: params.tenantUserId,
          storeSlug: params.storeSlug,
          saiposSaleId: cls.saiposSaleId,
        },
      },
      create: {
        userId: params.tenantUserId,
        storeSlug: params.storeSlug,
        competencia: params.competencia,
        data: new Date(`${cls.data}T12:00:00.000Z`),
        categoria: cls.categoria,
        consumidor: cls.consumidor,
        formaPagamento: cls.formaPagamento,
        valorItens: decimal(cls.valorItens),
        saiposSaleId: cls.saiposSaleId,
        origem: 'SAIPOS',
        ignorada: false,
      },
      update: {
        competencia: params.competencia,
        data: new Date(`${cls.data}T12:00:00.000Z`),
        categoria: cls.categoria,
        consumidor: cls.consumidor,
        formaPagamento: cls.formaPagamento,
        valorItens: decimal(cls.valorItens),
        origem: 'SAIPOS',
        // não desfazer ignorada manual do usuário
      },
    });
    upserted += 1;
  }

  // Pedidos SAIPOS da competência que sumiram ou foram cancelados
  const existentes = await prisma.cmvRefeicao.findMany({
    where: {
      userId: params.tenantUserId,
      storeSlug: params.storeSlug,
      competencia: params.competencia,
      origem: 'SAIPOS',
      saiposSaleId: { not: null },
    },
  });

  let removedOrIgnored = 0;
  for (const row of existentes) {
    if (!row.saiposSaleId || seenIds.has(row.saiposSaleId)) continue;
    await prisma.cmvRefeicao.update({
      where: { id: row.id },
      data: { ignorada: true },
    });
    removedOrIgnored += 1;
  }

  const persistVenda = params.persistVenda !== false;
  if (persistVenda) {
    const origemAtual = fechamento?.vendaMesOrigem;
    const sobrescreverVenda = origemAtual !== 'MANUAL';
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
        vendaMes: decimal(vendaMesSaipos),
        vendaMesOrigem: 'SAIPOS',
        vendaMesDetalhe: detalhe as unknown as Prisma.InputJsonValue,
        ajustes: [],
        refeicoesFuncionarios: [],
      },
      update: {
        vendaMesDetalhe: detalhe as unknown as Prisma.InputJsonValue,
        ...(sobrescreverVenda
          ? {
              vendaMes: decimal(vendaMesSaipos),
              vendaMesOrigem: 'SAIPOS',
            }
          : {}),
      },
    });
  }

  if (calc.formasDesconhecidas.length > 0) {
    void notificarFormasPagamentoDesconhecidas({
      tenantUserId: params.tenantUserId,
      actorUserId: params.actorUserId || params.tenantUserId,
      storeSlug: params.storeSlug,
      competencia: params.competencia,
      formas: calc.formasDesconhecidas,
    });
  }

  return {
    upserted,
    removedOrIgnored,
    vendaMesSaipos: Math.round(vendaMesSaipos * 100) / 100,
    totalSalesFetched: sales.length,
    vendaMesDetalhe: detalhe,
    formasDesconhecidas: calc.formasDesconhecidas,
  };
}

export async function listRefeicoesCompetencia(params: {
  tenantUserId: string;
  storeSlug: string;
  competencia: string;
}) {
  return prisma.cmvRefeicao.findMany({
    where: {
      userId: params.tenantUserId,
      storeSlug: params.storeSlug,
      competencia: params.competencia,
    },
    orderBy: [{ data: 'asc' }, { createdAt: 'asc' }],
  });
}
