import { randomBytes } from 'crypto';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import {
  fetchSalesForCompetencia,
  type SaiposStoreSlug,
} from '@/lib/saipos/dataApi';
import {
  classificarRefeicao,
  parseRefeicaoRegras,
  type ClassificacaoRefeicao,
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

function newCuid(): string {
  // PK: createMany/raw não aplica @default(cuid()) do Prisma
  return `c${randomBytes(16).toString('hex')}`;
}

const UPSERT_CHUNK = 100;

/**
 * Upsert em lote (INSERT … ON CONFLICT). Não toca em `ignorada`.
 */
async function upsertRefeicoesLote(params: {
  tenantUserId: string;
  storeSlug: string;
  competencia: string;
  rows: ClassificacaoRefeicao[];
}): Promise<number> {
  if (params.rows.length === 0) return 0;

  for (let i = 0; i < params.rows.length; i += UPSERT_CHUNK) {
    const chunk = params.rows.slice(i, i + UPSERT_CHUNK);
    const values = chunk.map((cls) => {
      const id = newCuid();
      const data = new Date(`${cls.data}T12:00:00.000Z`);
      return Prisma.sql`(
        ${id},
        ${params.tenantUserId},
        ${params.storeSlug},
        ${params.competencia},
        ${data},
        ${cls.categoria},
        ${cls.consumidor},
        ${cls.formaPagamento},
        ${cls.valorItens},
        ${cls.saiposSaleId},
        ${'SAIPOS'},
        ${false},
        NOW(),
        NOW()
      )`;
    });

    await prisma.$executeRaw`
      INSERT INTO cmv_refeicoes (
        id, user_id, store_slug, competencia, data, categoria, consumidor,
        forma_pagamento, valor_itens, saipos_sale_id, origem, ignorada,
        created_at, updated_at
      )
      VALUES ${Prisma.join(values)}
      ON CONFLICT (user_id, store_slug, saipos_sale_id)
      DO UPDATE SET
        competencia = EXCLUDED.competencia,
        data = EXCLUDED.data,
        categoria = EXCLUDED.categoria,
        consumidor = EXCLUDED.consumidor,
        forma_pagamento = EXCLUDED.forma_pagamento,
        valor_itens = EXCLUDED.valor_itens,
        origem = EXCLUDED.origem,
        updated_at = NOW()
    `;
  }

  return params.rows.length;
}

export type SyncRefeicoesTimings = {
  fetchMs: number;
  calcMs: number;
  upsertMs: number;
  ignoreMs: number;
  fechamentoMs: number;
  totalMs: number;
};

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
  timings: SyncRefeicoesTimings;
}> {
  const t0 = Date.now();

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

  const tFetch0 = Date.now();
  const sales = (await fetchSalesForCompetencia({
    storeSlug: asSlug(params.storeSlug),
    competencia: params.competencia,
  })) as SaiposSaleLike[];
  const fetchMs = Date.now() - tFetch0;

  const tCalc0 = Date.now();
  const calc = calcularVendaLiquida(sales as SaiposSaleVendaLike[], vendaCfg);
  const prevDetalhe = parseVendaMesDetalhe(fechamento?.vendaMesDetalhe);
  const detalhe = buildVendaMesDetalhe(calc, prevDetalhe?.ajusteVenda ?? null);
  const vendaMesSaipos = vendaMesEfetiva(detalhe) ?? detalhe.vendaLiquida;

  const classificados: ClassificacaoRefeicao[] = [];
  const seenIds = new Set<string>();
  for (const sale of sales) {
    const cls = classificarRefeicao(sale, regras);
    if (!cls) continue;
    seenIds.add(cls.saiposSaleId);
    classificados.push(cls);
  }
  const calcMs = Date.now() - tCalc0;

  const tUpsert0 = Date.now();
  const upserted = await upsertRefeicoesLote({
    tenantUserId: params.tenantUserId,
    storeSlug: params.storeSlug,
    competencia: params.competencia,
    rows: classificados,
  });
  const upsertMs = Date.now() - tUpsert0;

  // Pedidos SAIPOS da competência que sumiram ou foram cancelados
  const tIgn0 = Date.now();
  let removedOrIgnored = 0;
  if (seenIds.size === 0) {
    const r = await prisma.cmvRefeicao.updateMany({
      where: {
        userId: params.tenantUserId,
        storeSlug: params.storeSlug,
        competencia: params.competencia,
        origem: 'SAIPOS',
        saiposSaleId: { not: null },
        ignorada: false,
      },
      data: { ignorada: true },
    });
    removedOrIgnored = r.count;
  } else {
    const r = await prisma.cmvRefeicao.updateMany({
      where: {
        userId: params.tenantUserId,
        storeSlug: params.storeSlug,
        competencia: params.competencia,
        origem: 'SAIPOS',
        saiposSaleId: { notIn: [...seenIds] },
        ignorada: false,
      },
      data: { ignorada: true },
    });
    removedOrIgnored = r.count;
  }
  const ignoreMs = Date.now() - tIgn0;

  const persistVenda = params.persistVenda !== false;
  let fechamentoMs = 0;
  if (persistVenda) {
    const tFech0 = Date.now();
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
    fechamentoMs = Date.now() - tFech0;
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

  const timings: SyncRefeicoesTimings = {
    fetchMs,
    calcMs,
    upsertMs,
    ignoreMs,
    fechamentoMs,
    totalMs: Date.now() - t0,
  };

  return {
    upserted,
    removedOrIgnored,
    vendaMesSaipos: Math.round(vendaMesSaipos * 100) / 100,
    totalSalesFetched: sales.length,
    vendaMesDetalhe: detalhe,
    formasDesconhecidas: calc.formasDesconhecidas,
    timings,
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
