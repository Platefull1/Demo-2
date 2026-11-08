/**
 * Dry-run Ahú OUT/2026 com Reentrega nos créditos.
 * npx tsx --env-file=.env scripts/dry-run-ahu-reentrega.ts
 */
import { fetchSalesForCompetencia } from '../src/lib/saipos/dataApi';
import {
  calcularVendaLiquida,
  DEFAULT_VENDA_LIQUIDA_CONFIG,
} from '../src/lib/cmv-real/venda-liquida';

const PLANILHA = 688_341.78;

function money(n: number) {
  return n.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

async function main() {
  const sales = await fetchSalesForCompetencia({
    storeSlug: 'ahu',
    competencia: '2026-10',
  });
  const calc = calcularVendaLiquida(sales as never, DEFAULT_VENDA_LIQUIDA_CONFIG);
  console.log(
    [
      `bruto=${money(calc.vendaBruta)}`,
      `taxas>6,99=${money(calc.taxaEntregaExcluida)}`,
      `créditos=${money(calc.creditosExcluidos)}`,
      `consumo=${money(calc.consumoInterno)}`,
      `líquido=${money(calc.vendaLiquida)}`,
      `planilha=${money(PLANILHA)}`,
      `diff=${money(Math.round((calc.vendaLiquida - PLANILHA) * 100) / 100)}`,
    ].join(' | '),
  );
  console.log('(diff esperado vs planilha ≈ −168: taxas digitadas à mão)');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
