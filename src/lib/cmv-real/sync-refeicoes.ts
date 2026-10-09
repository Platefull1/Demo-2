import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import {
  fetchSalesForCompetencia,
  type SaiposStoreSlug,
} from '@/lib/saipos/dataApi';
import {
  classificarRefeicao,
  parseRefeicaoRegras,
  parseVendaMesConfig,
  valorVendaParaMes,
  type SaiposSaleLike,
} from '@/lib/cmv-real/refeicoes';

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

export async function syncRefeicoesSaipos(params: {
  tenantUserId: string;
  storeSlug: string;
  competencia: string;
}): Promise<{
  upserted: number;
  removedOrIgnored: number;
  vendaMesSaipos: number;
  totalSalesFetched: number;
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
  const vendaCfg = parseVendaMesConfig(config?.vendaMesConfig);

  const sales = (await fetchSalesForCompetencia({
    storeSlug: asSlug(params.storeSlug),
    competencia: params.competencia,
  })) as SaiposSaleLike[];

  const seenIds = new Set<string>();
  let upserted = 0;
  let vendaMesSaipos = 0;

  for (const sale of sales) {
    vendaMesSaipos += valorVendaParaMes(sale, { regras, config: vendaCfg });

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

  return {
    upserted,
    removedOrIgnored,
    vendaMesSaipos: Math.round(vendaMesSaipos * 100) / 100,
    totalSalesFetched: sales.length,
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
