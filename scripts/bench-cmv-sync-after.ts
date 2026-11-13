/**
 * Re-mede após otimizações (sem importar sync-refeicoes → evita Stack no tsx).
 *   npx tsx --env-file=.env scripts/bench-cmv-sync-after.ts ahu 2026-11
 */

import { randomBytes } from 'crypto';
import { Prisma, PrismaClient } from '@prisma/client';
import { fetchSalesForCompetencia } from '../src/lib/saipos/dataApi';
import {
  classificarRefeicao,
  parseRefeicaoRegras,
  type SaiposSaleLike,
} from '../src/lib/cmv-real/refeicoes';
import {
  buildVendaMesDetalhe,
  calcularVendaLiquida,
  parseVendaMesDetalhe,
  resolveVendaLiquidaConfig,
  type SaiposSaleVendaLike,
} from '../src/lib/cmv-real/venda-liquida';

const prisma = new PrismaClient();
const OWNER = 'cmk5ykusf0001jz04iwmf8xa8';

function ms(n: number) {
  return `${(n / 1000).toFixed(2)}s`;
}

function newCuid() {
  return `c${randomBytes(16).toString('hex')}`;
}

async function main() {
  const storeSlug = (process.argv[2] || 'ahu') as 'ahu';
  const competencia = process.argv[3] || '2026-11';
  console.log(`\n=== Bench AFTER ${storeSlug} ${competencia} ===\n`);
  const t0 = Date.now();

  const tFetch0 = Date.now();
  const sales = (await fetchSalesForCompetencia({
    storeSlug,
    competencia,
  })) as SaiposSaleLike[];
  const fetchMs = Date.now() - tFetch0;
  console.log(`[FETCH paralelo] ${sales.length} vendas · ${ms(fetchMs)}`);

  const config = await prisma.nfeConfig.findUnique({ where: { userId: OWNER } });
  const regras = parseRefeicaoRegras(config?.refeicaoRegras);
  const vendaCfg = resolveVendaLiquidaConfig(
    config?.vendaMesConfig,
    process.env.CMV_LIMITE_TAXA_ENTREGA,
  );

  const tCalc0 = Date.now();
  const calc = calcularVendaLiquida(sales as SaiposSaleVendaLike[], vendaCfg);
  const classificados = [];
  const seenIds = new Set<string>();
  for (const sale of sales) {
    const cls = classificarRefeicao(sale, regras);
    if (!cls) continue;
    seenIds.add(cls.saiposSaleId);
    classificados.push(cls);
  }
  const calcMs = Date.now() - tCalc0;
  console.log(`[CALC] refeições=${classificados.length} · ${ms(calcMs)}`);

  const tUpsert0 = Date.now();
  const CHUNK = 100;
  for (let i = 0; i < classificados.length; i += CHUNK) {
    const chunk = classificados.slice(i, i + CHUNK);
    const values = chunk.map((cls) => {
      const data = new Date(`${cls.data}T12:00:00.000Z`);
      return Prisma.sql`(
        ${newCuid()},
        ${OWNER},
        ${storeSlug},
        ${competencia},
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
  const upsertMs = Date.now() - tUpsert0;
  console.log(`[UPSERT lote] ${classificados.length} rows · ${ms(upsertMs)}`);

  const tIgn0 = Date.now();
  const ign = await prisma.cmvRefeicao.updateMany({
    where: {
      userId: OWNER,
      storeSlug,
      competencia,
      origem: 'SAIPOS',
      saiposSaleId: { notIn: [...seenIds] },
      ignorada: false,
    },
    data: { ignorada: true },
  });
  const ignoreMs = Date.now() - tIgn0;
  console.log(`[IGNORE lote] ${ign.count} · ${ms(ignoreMs)}`);

  const fechamento = await prisma.cmvFechamento.findUnique({
    where: {
      userId_storeSlug_competencia: { userId: OWNER, storeSlug, competencia },
    },
  });
  const detalhe = buildVendaMesDetalhe(
    calc,
    parseVendaMesDetalhe(fechamento?.vendaMesDetalhe)?.ajusteVenda ?? null,
  );
  const tFech0 = Date.now();
  await prisma.cmvFechamento.upsert({
    where: {
      userId_storeSlug_competencia: { userId: OWNER, storeSlug, competencia },
    },
    create: {
      userId: OWNER,
      storeSlug,
      competencia,
      status: 'ABERTO',
      vendaMes: new Prisma.Decimal(detalhe.vendaLiquida),
      vendaMesOrigem: 'SAIPOS',
      vendaMesDetalhe: detalhe as unknown as Prisma.InputJsonValue,
      ajustes: [],
      refeicoesFuncionarios: [],
    },
    update: {
      vendaMesDetalhe: detalhe as unknown as Prisma.InputJsonValue,
      vendaMes: new Prisma.Decimal(
        detalhe.vendaLiquida + (detalhe.ajusteVenda?.valor ?? 0),
      ),
      vendaMesOrigem: 'SAIPOS',
    },
  });
  const fechamentoMs = Date.now() - tFech0;

  const total = Date.now() - t0;
  console.log('\n=== RESUMO AFTER ===');
  console.log(`fetch Saipos:     ${ms(fetchMs)}  (${((fetchMs / total) * 100).toFixed(0)}%)`);
  console.log(`calc/classificar: ${ms(calcMs)}`);
  console.log(`upserts lote:     ${ms(upsertMs)}  (${((upsertMs / total) * 100).toFixed(0)}%)`);
  console.log(`ignore lote:      ${ms(ignoreMs)}`);
  console.log(`fechamento:       ${ms(fechamentoMs)}`);
  console.log(`TOTAL:            ${ms(total)}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
