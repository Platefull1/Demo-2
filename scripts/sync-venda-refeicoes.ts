/**
 * Sync Saipos (venda + refeições) Portão e Uberaba, competência 2026-10.
 * Mostra status atual, aplica, lista 1–21/10.
 * npx tsx --env-file=.env scripts/sync-venda-refeicoes.ts
 */
import { Prisma } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import { syncRefeicoesSaipos } from '../src/lib/cmv-real/sync-refeicoes';

const OWNER = 'cmk5ykusf0001jz04iwmf8xa8';
const COMP = '2026-10';
const LOJAS = ['uberaba', 'portao'] as const;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
const prisma = new PrismaClient();

async function status(storeSlug: string) {
  const f = await prisma.cmvFechamento.findUnique({
    where: {
      userId_storeSlug_competencia: {
        userId: OWNER,
        storeSlug,
        competencia: COMP,
      },
    },
    select: { status: true, vendaMes: true, vendaMesOrigem: true },
  });
  const refs = await prisma.cmvRefeicao.findMany({
    where: { userId: OWNER, storeSlug, competencia: COMP, ignorada: false },
    select: { data: true, categoria: true, valorItens: true, origem: true },
    orderBy: { data: 'asc' },
  });
  return { f, refs };
}

function diaSP(d: Date) {
  return d.toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });
}

async function main() {
  for (const loja of LOJAS) {
    const antes = await status(loja);
    console.log(`=== ${loja} ANTES ===`);
    console.log({
      fechamento: antes.f?.status,
      vendaMes: antes.f?.vendaMes != null ? Number(antes.f.vendaMes) : null,
      origem: antes.f?.vendaMesOrigem,
      refeicoes: antes.refs.length,
      somaRef: antes.refs.reduce((s, r) => s + Number(r.valorItens), 0),
    });

    if (antes.f?.status === 'FECHADO') {
      console.log(loja, 'FECHADO — pulando sync');
      continue;
    }

    let sync: Awaited<ReturnType<typeof syncRefeicoesSaipos>> | null = null;
    for (let attempt = 1; attempt <= 4; attempt++) {
      try {
        sync = await syncRefeicoesSaipos({
          tenantUserId: OWNER,
          storeSlug: loja,
          competencia: COMP,
        });
        break;
      } catch (e) {
        console.log(loja, 'tentativa', attempt, e instanceof Error ? e.message : e);
        if (attempt === 4) throw e;
        await sleep(8000 * attempt);
      }
    }
    if (!sync) throw new Error('sync falhou');
    console.log('sync', sync);

    await prisma.cmvFechamento.upsert({
      where: {
        userId_storeSlug_competencia: {
          userId: OWNER,
          storeSlug: loja,
          competencia: COMP,
        },
      },
      create: {
        userId: OWNER,
        storeSlug: loja,
        competencia: COMP,
        status: 'ABERTO',
        vendaMes: new Prisma.Decimal(sync.vendaMesSaipos),
        vendaMesOrigem: 'SAIPOS',
        ajustes: [],
        refeicoesFuncionarios: [],
      },
      update: {
        vendaMes: new Prisma.Decimal(sync.vendaMesSaipos),
        vendaMesOrigem: 'SAIPOS',
      },
    });

    const depois = await status(loja);
    console.log(`=== ${loja} DEPOIS ===`);
    console.log({
      fechamento: depois.f?.status,
      vendaMes: depois.f?.vendaMes != null ? Number(depois.f.vendaMes) : null,
      origem: depois.f?.vendaMesOrigem,
      refeicoes: depois.refs.length,
      somaRef: depois.refs.reduce((s, r) => s + Number(r.valorItens), 0),
    });

    const porDia: Record<string, { n: number; valor: number; cats: Record<string, number> }> = {};
    for (const r of depois.refs) {
      const d = diaSP(r.data);
      if (d < '2026-10-01' || d > '2026-10-21') continue;
      porDia[d] ??= { n: 0, valor: 0, cats: {} };
      porDia[d].n += 1;
      porDia[d].valor += Number(r.valorItens);
      porDia[d].cats[r.categoria] = (porDia[d].cats[r.categoria] ?? 0) + Number(r.valorItens);
    }
    console.log(`=== ${loja} refeições 1–21/10 ===`);
    for (const d of Object.keys(porDia).sort()) {
      console.log(d, porDia[d]);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
