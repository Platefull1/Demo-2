/**
 * Dry-run venda líquida OUT/2026 — 4 lojas vs planilha / banco.
 * NÃO grava fechamento (persistVenda: false). Só calcula e compara.
 *
 * npx tsx --env-file=.env scripts/dry-run-venda-liquida-out-2026.ts
 *
 * Planilha conhecida: Ahú = 688.341,78 (docs/auditoria-cmv-ahu-out-2026.md).
 * Demais lojas: compara com CmvFechamento.vendaMes atual se existir.
 */
import { PrismaClient } from '@prisma/client';
import { fetchSalesForCompetencia, type SaiposStoreSlug } from '../src/lib/saipos/dataApi';
import {
  calcularVendaLiquida,
  resolveVendaLiquidaConfig,
  type SaiposSaleVendaLike,
} from '../src/lib/cmv-real/venda-liquida';

const OWNER = 'cmk5ykusf0001jz04iwmf8xa8';
const COMP = '2026-10';
const LOJAS: SaiposStoreSlug[] = ['ahu', 'pilarzinho', 'portao', 'uberaba'];

/** Líquidos oficiais da planilha quando conhecidos. */
const PLANILHA: Partial<Record<SaiposStoreSlug, number>> = {
  ahu: 688_341.78,
};

const prisma = new PrismaClient();

function money(n: number) {
  return n.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

async function main() {
  const config = await prisma.nfeConfig.findUnique({ where: { userId: OWNER } });
  const vendaCfg = resolveVendaLiquidaConfig(
    config?.vendaMesConfig,
    process.env.CMV_LIMITE_TAXA_ENTREGA,
  );

  console.log(`=== Dry-run venda líquida ${COMP} ===`);
  console.log(
    `Limite taxa: ${vendaCfg.limiteTaxaEntrega} | Consumo: ${vendaCfg.formasConsumoInterno.join(', ')}`,
  );
  console.log('');
  console.log(
    [
      'loja',
      'bruto',
      'taxa_exc',
      'consumo',
      'creditos',
      'liquido_calc',
      'planilha',
      'banco',
      'diff_planilha',
    ].join('\t'),
  );

  for (const loja of LOJAS) {
    const sales = (await fetchSalesForCompetencia({
      storeSlug: loja,
      competencia: COMP,
    })) as SaiposSaleVendaLike[];

    const calc = calcularVendaLiquida(sales, vendaCfg);
    const planilha = PLANILHA[loja] ?? null;

    const fech = await prisma.cmvFechamento.findUnique({
      where: {
        userId_storeSlug_competencia: {
          userId: OWNER,
          storeSlug: loja,
          competencia: COMP,
        },
      },
      select: { vendaMes: true, vendaMesOrigem: true },
    });
    const banco = fech?.vendaMes != null ? Number(fech.vendaMes) : null;

    const ref = planilha ?? banco;
    const diff = ref != null ? Math.round((calc.vendaLiquida - ref) * 100) / 100 : null;

    console.log(
      [
        loja,
        money(calc.vendaBruta),
        money(calc.taxaEntregaExcluida),
        money(calc.consumoInterno),
        money(calc.creditosExcluidos),
        money(calc.vendaLiquida),
        planilha != null ? money(planilha) : '—',
        banco != null ? money(banco) : '—',
        diff != null ? money(diff) : '—',
      ].join('\t'),
    );

    if (calc.formasDesconhecidas.length) {
      console.log(
        `  formas desconhecidas (${calc.formasDesconhecidas.length}):`,
        calc.formasDesconhecidas.slice(0, 15).join(', '),
      );
    }

    if (diff != null && Math.abs(diff) >= 0.01) {
      console.log(
        `  !! diff ≠ 0 — pedidos=${calc.totalPedidos} cancelados=${calc.pedidosCancelados} jantas>0=${calc.jantasComValor.length}`,
      );
      console.log(
        `  taxas > limite:`,
        calc.taxasAcimaLimiteDistintas.map(money).join(', ') || '(nenhuma)',
      );
      // Top formas de pagamento por valor (diagnóstico)
      const porForma = new Map<string, number>();
      for (const s of sales) {
        if (String(s.canceled || '').toUpperCase() === 'Y') continue;
        for (const p of s.payments || []) {
          const label = String(p?.desc_store_payment_type || '').trim() || '(vazio)';
          const amt = Number(p?.payment_amount) || 0;
          porForma.set(label, (porForma.get(label) || 0) + amt);
        }
      }
      const top = [...porForma.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 12);
      console.log('  top formas (payment_amount):');
      for (const [f, v] of top) {
        console.log(`    ${f}: ${money(v)}`);
      }
    }
  }

  console.log('');
  console.log('Dry-run concluído — nada foi gravado.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
