/**
 * Venda Saipos setembro (só leitura), com retry e total parcial.
 * Outubro 1–21 sai do CmvFechamento (já sincronizado).
 * npx tsx --env-file=.env scripts/venda-saipos-setembro.ts
 */
import { writeFileSync } from 'fs';
import { PrismaClient } from '@prisma/client';
import {
  fetchSalesPage,
  splitShiftDateWindows,
  type SaiposStoreSlug,
} from '../src/lib/saipos/dataApi';
import {
  parseRefeicaoRegras,
  parseVendaMesConfig,
  valorVendaParaMes,
  type SaiposSaleLike,
} from '../src/lib/cmv-real/refeicoes';

const OWNER = 'cmk5ykusf0001jz04iwmf8xa8';
const LOJAS: SaiposStoreSlug[] = ['ahu', 'pilarzinho', 'portao', 'uberaba'];
const prisma = new PrismaClient();

async function sleep(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}

async function paginaComRetry(
  loja: SaiposStoreSlug,
  start: string,
  end: string,
  offset: number,
) {
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      const t0 = Date.now();
      const page = await fetchSalesPage({
        storeSlug: loja,
        startDate: start,
        endDate: end,
        limit: 1000,
        offset,
      });
      console.log(
        `  ${loja} ${start}..${end} offset=${offset} n=${page.length} ${Date.now() - t0}ms`,
      );
      return page as SaiposSaleLike[];
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.log(`  retry ${attempt} ${loja} offset=${offset}: ${msg}`);
      if (attempt === 5) throw e;
      await sleep(8000 * attempt);
    }
  }
  return [];
}

async function somarPeriodo(
  loja: SaiposStoreSlug,
  start: string,
  end: string,
  regras: ReturnType<typeof parseRefeicaoRegras>,
  vendaCfg: ReturnType<typeof parseVendaMesConfig>,
) {
  const windows = splitShiftDateWindows(start, end);
  let n = 0;
  let venda = 0;
  for (const win of windows) {
    let offset = 0;
    for (;;) {
      const page = await paginaComRetry(loja, win.start, win.end, offset);
      n += page.length;
      for (const s of page) venda += valorVendaParaMes(s, { regras, config: vendaCfg });
      if (page.length < 1000) break;
      offset += 1000;
      await sleep(1500);
    }
  }
  return { n, venda: Math.round(venda * 100) / 100 };
}

async function main() {
  const config = await prisma.nfeConfig.findUnique({ where: { userId: OWNER } });
  const regras = parseRefeicaoRegras(config?.refeicaoRegras);
  const vendaCfg = parseVendaMesConfig(config?.vendaMesConfig);

  const fechOut: Record<string, { venda: number | null; origem: string | null }> = {};
  for (const loja of LOJAS) {
    const f = await prisma.cmvFechamento.findUnique({
      where: {
        userId_storeSlug_competencia: {
          userId: OWNER,
          storeSlug: loja,
          competencia: '2026-10',
        },
      },
      select: { vendaMes: true, vendaMesOrigem: true },
    });
    fechOut[loja] = {
      venda: f?.vendaMes != null ? Number(f.vendaMes) : null,
      origem: f?.vendaMesOrigem ?? null,
    };
  }
  console.log('fechamento out 1-21', fechOut);

  const out: Record<string, unknown> = {};
  for (const loja of LOJAS) {
    console.log('===', loja, 'setembro');
    const set = await somarPeriodo(loja, '2026-09-01', '2026-09-30', regras, vendaCfg);
    out[loja] = { set, out21: fechOut[loja] };
    console.log(loja, out[loja]);
    writeFileSync('scripts/.venda-saipos-setembro.json', JSON.stringify(out, null, 2));
    await sleep(4000);
  }
  console.log('=== TOTAL ===');
  console.log(JSON.stringify(out, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
