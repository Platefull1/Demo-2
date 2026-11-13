/**
 * Mede onde o sync CMV gasta tempo (fetch Saipos vs upserts).
 *
 * Uso:
 *   npx tsx --env-file=.env scripts/bench-cmv-sync.ts [loja] [competencia]
 *   npx tsx --env-file=.env scripts/bench-cmv-sync.ts ahu 2026-11
 */

import { Prisma, PrismaClient } from '@prisma/client';
import {
  fetchSalesPage,
  monthShiftDateWindows,
  type SaiposStoreSlug,
} from '../src/lib/saipos/dataApi';
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
const LIMIT = 1000;
const SLEEP_MS = 600;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function ms(n: number) {
  return `${(n / 1000).toFixed(2)}s`;
}

async function main() {
  const storeSlug = (process.argv[2] || 'ahu') as SaiposStoreSlug;
  const competencia = process.argv[3] || '2026-11';
  console.log(`\n=== Bench sync CMV ${storeSlug} ${competencia} ===\n`);

  const t0 = Date.now();

  // --- 1) Fetch Saipos (espelha fetchAllSales atual) ---
  const windows = monthShiftDateWindows(competencia);
  console.log(`Janelas Saipos (≤15d): ${windows.map((w) => `${w.start}→${w.end}`).join(', ')}`);

  const all: unknown[] = [];
  let pageCount = 0;
  let sleepTotal = 0;
  const pageTimes: number[] = [];

  const tFetch0 = Date.now();
  for (const win of windows) {
    let offset = 0;
    for (;;) {
      const tp = Date.now();
      const page = await fetchSalesPage({
        storeSlug,
        startDate: win.start,
        endDate: win.end,
        limit: LIMIT,
        offset,
      });
      const pageMs = Date.now() - tp;
      pageTimes.push(pageMs);
      pageCount += 1;
      all.push(...page);
      console.log(
        `  page#${pageCount} offset=${offset} n=${page.length} ${ms(pageMs)} (${win.start}→${win.end})`,
      );
      if (page.length < LIMIT) break;
      offset += LIMIT;
      const ts = Date.now();
      await sleep(SLEEP_MS);
      sleepTotal += Date.now() - ts;
    }
  }
  const fetchMs = Date.now() - tFetch0;
  console.log(
    `\n[FETCH] ${all.length} vendas · ${pageCount} páginas · total ${ms(fetchMs)}` +
      ` (HTTP ${(pageTimes.reduce((a, b) => a + b, 0) / 1000).toFixed(2)}s + sleep ${ms(sleepTotal)})`,
  );
  console.log(
    `        HTTP médio/página: ${ms(pageTimes.reduce((a, b) => a + b, 0) / pageTimes.length)}` +
      ` · min ${ms(Math.min(...pageTimes))} · max ${ms(Math.max(...pageTimes))}`,
  );

  // --- 2) Cálculo venda líquida + classificação ---
  const config = await prisma.nfeConfig.findUnique({ where: { userId: OWNER } });
  const regras = parseRefeicaoRegras(config?.refeicaoRegras);
  const vendaCfg = resolveVendaLiquidaConfig(
    config?.vendaMesConfig,
    process.env.CMV_LIMITE_TAXA_ENTREGA,
  );

  const tCalc0 = Date.now();
  const sales = all as SaiposSaleLike[];
  const calc = calcularVendaLiquida(sales as SaiposSaleVendaLike[], vendaCfg);
  const classificados: NonNullable<ReturnType<typeof classificarRefeicao>>[] = [];
  for (const sale of sales) {
    const cls = classificarRefeicao(sale, regras);
    if (cls) classificados.push(cls);
  }
  const calcMs = Date.now() - tCalc0;
  console.log(
    `\n[CALC] venda líquida + classificar: ${ms(calcMs)} · refeições=${classificados.length}` +
      ` · líquida=${calc.vendaLiquida}`,
  );

  // --- 3) Upserts um a um (como produção) ---
  const fechamento = await prisma.cmvFechamento.findUnique({
    where: {
      userId_storeSlug_competencia: {
        userId: OWNER,
        storeSlug,
        competencia,
      },
    },
  });
  if (fechamento?.status === 'FECHADO') {
    console.log('\nCompetência FECHADA — abortando escrita.');
    return;
  }

  const tUpsert0 = Date.now();
  const seenIds = new Set<string>();
  let upserted = 0;
  for (const cls of classificados) {
    seenIds.add(cls.saiposSaleId);
    await prisma.cmvRefeicao.upsert({
      where: {
        userId_storeSlug_saiposSaleId: {
          userId: OWNER,
          storeSlug,
          saiposSaleId: cls.saiposSaleId,
        },
      },
      create: {
        userId: OWNER,
        storeSlug,
        competencia,
        data: new Date(`${cls.data}T12:00:00.000Z`),
        categoria: cls.categoria,
        consumidor: cls.consumidor,
        formaPagamento: cls.formaPagamento,
        valorItens: new Prisma.Decimal(cls.valorItens),
        saiposSaleId: cls.saiposSaleId,
        origem: 'SAIPOS',
        ignorada: false,
      },
      update: {
        competencia,
        data: new Date(`${cls.data}T12:00:00.000Z`),
        categoria: cls.categoria,
        consumidor: cls.consumidor,
        formaPagamento: cls.formaPagamento,
        valorItens: new Prisma.Decimal(cls.valorItens),
        origem: 'SAIPOS',
      },
    });
    upserted += 1;
  }
  const upsertMs = Date.now() - tUpsert0;
  console.log(
    `\n[UPSERT 1-a-1] ${upserted} rows · ${ms(upsertMs)}` +
      (upserted
        ? ` · média ${ms(upsertMs / upserted)}/row`
        : ''),
  );

  // --- 4) Mark missing as ignored (1-a-1) ---
  const existentes = await prisma.cmvRefeicao.findMany({
    where: {
      userId: OWNER,
      storeSlug,
      competencia,
      origem: 'SAIPOS',
      saiposSaleId: { not: null },
    },
  });
  const tIgn0 = Date.now();
  let removedOrIgnored = 0;
  for (const row of existentes) {
    if (!row.saiposSaleId || seenIds.has(row.saiposSaleId)) continue;
    await prisma.cmvRefeicao.update({
      where: { id: row.id },
      data: { ignorada: true },
    });
    removedOrIgnored += 1;
  }
  const ignMs = Date.now() - tIgn0;
  console.log(`[IGNORE 1-a-1] ${removedOrIgnored} rows · ${ms(ignMs)}`);

  // --- 5) Fechamento upsert ---
  const prev = parseVendaMesDetalhe(fechamento?.vendaMesDetalhe);
  const detalhe = buildVendaMesDetalhe(calc, prev?.ajusteVenda ?? null);
  const tFech0 = Date.now();
  await prisma.cmvFechamento.upsert({
    where: {
      userId_storeSlug_competencia: {
        userId: OWNER,
        storeSlug,
        competencia,
      },
    },
    create: {
      userId: OWNER,
      storeSlug,
      competencia,
      status: 'ABERTO',
      vendaMes: new Prisma.Decimal(detalhe.vendaLiquida + (detalhe.ajusteVenda?.valor ?? 0)),
      vendaMesOrigem: 'SAIPOS',
      vendaMesDetalhe: detalhe as unknown as Prisma.InputJsonValue,
      ajustes: [],
      refeicoesFuncionarios: [],
    },
    update: {
      vendaMesDetalhe: detalhe as unknown as Prisma.InputJsonValue,
      ...(fechamento?.vendaMesOrigem !== 'MANUAL'
        ? {
            vendaMes: new Prisma.Decimal(
              detalhe.vendaLiquida + (detalhe.ajusteVenda?.valor ?? 0),
            ),
            vendaMesOrigem: 'SAIPOS',
          }
        : {}),
    },
  });
  const fechMs = Date.now() - tFech0;

  const total = Date.now() - t0;
  console.log(`\n[FECHAMENTO] ${ms(fechMs)}`);
  console.log('\n=== RESUMO ===');
  console.log(`fetch Saipos:     ${ms(fetchMs)}  (${((fetchMs / total) * 100).toFixed(0)}%)`);
  console.log(`  └ sleep 600ms:  ${ms(sleepTotal)}`);
  console.log(`calc/classificar: ${ms(calcMs)}  (${((calcMs / total) * 100).toFixed(0)}%)`);
  console.log(`upserts 1-a-1:    ${ms(upsertMs)}  (${((upsertMs / total) * 100).toFixed(0)}%)`);
  console.log(`ignore 1-a-1:     ${ms(ignMs)}  (${((ignMs / total) * 100).toFixed(0)}%)`);
  console.log(`fechamento:       ${ms(fechMs)}`);
  console.log(`TOTAL:            ${ms(total)}`);
  console.log('');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
