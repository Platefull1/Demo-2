/**
 * Dry-run regra final venda líquida + diagnóstico Ahú OUT/2026 (Δ R$ 134).
 * NÃO grava.
 *
 * npx tsx --env-file=.env scripts/dry-run-venda-liquida-regra-final.ts
 */
import { fetchSalesForCompetencia, type SaiposStoreSlug } from '../src/lib/saipos/dataApi';
import {
  isCanceledSale,
  normalizeText,
  parseMoney,
} from '../src/lib/cmv-real/refeicoes';
import {
  calcularVendaLiquida,
  DEFAULT_VENDA_LIQUIDA_CONFIG,
  type SaiposSaleVendaLike,
} from '../src/lib/cmv-real/venda-liquida';

const COMP = '2026-10';
const LOJAS: SaiposStoreSlug[] = ['ahu', 'pilarzinho', 'portao', 'uberaba'];
const PLANILHA_AHU = 688_341.78;
const PLANILHA_TAXAS = 6_868;
const LIMITE = 6.99;

type Sale = SaiposSaleVendaLike & {
  id_sale_type?: number | string | null;
  partner_sale?: {
    desc_partner_sale?: string | null;
    desc_store_partner?: string | null;
  } | null;
  notes?: string | null;
  desc_sale?: string | null;
  total_discount?: number | string | null;
  total_amount_items?: number | string | null;
};

function money(n: number) {
  return n.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function r2(n: number) {
  return Math.round(n * 100) / 100;
}

function partnerOf(s: Sale): string {
  return String(s.partner_sale?.desc_partner_sale || '').trim() || 'sem_parceiro';
}

function isIfood(s: Sale): boolean {
  return normalizeText(partnerOf(s)).includes('IFOOD');
}

function looksReentrega(s: Sale): boolean {
  const blob = normalizeText(
    [s.notes, s.desc_sale, s.customer?.name].filter(Boolean).join(' '),
  );
  return (
    blob.includes('REENTREGA') ||
    blob.includes('RE-ENTREGA') ||
    blob.includes('RE ENTREGA') ||
    blob.includes('2A ENTREGA') ||
    blob.includes('SEGUNDA ENTREGA')
  );
}

async function diagAhu(sales: Sale[]) {
  console.log('=== Diagnóstico Ahú — taxas > 6,99 e item R$ 34 ===');

  const highFee: Array<{
    sale_number: string | null;
    shift_date: string;
    fee: number;
    total: number;
    partner: string;
    ifood: boolean;
    reentrega: boolean;
    payments: string;
  }> = [];

  for (const s of sales) {
    if (isCanceledSale(s)) continue;
    const fee = r2(parseMoney(s.delivery?.delivery_fee));
    if (fee <= LIMITE + 1e-9) continue;
    const pays = (s.payments || [])
      .map((p) => `${p?.desc_store_payment_type}:${p?.payment_amount}`)
      .join(' | ');
    highFee.push({
      sale_number: s.sale_number != null ? String(s.sale_number) : null,
      shift_date: String(s.shift_date || '').slice(0, 10),
      fee,
      total: r2(parseMoney(s.total_amount)),
      partner: partnerOf(s),
      ifood: isIfood(s),
      reentrega: looksReentrega(s),
      payments: pays,
    });
  }

  const somaHigh = r2(highFee.reduce((a, x) => a + x.fee, 0));
  console.log(
    `Taxas > 6,99: API=${money(somaHigh)}  planilha=${money(PLANILHA_TAXAS)}  diff=${money(r2(somaHigh - PLANILHA_TAXAS))}`,
  );
  console.log(`Pedidos com taxa > 6,99: ${highFee.length}`);

  // Por canal × valor de taxa
  const byCanalFee = new Map<string, { qtd: number; soma: number }>();
  for (const h of highFee) {
    const k = `${h.partner}|${h.fee.toFixed(2)}`;
    const cur = byCanalFee.get(k) || { qtd: 0, soma: 0 };
    cur.qtd += 1;
    cur.soma = r2(cur.soma + h.fee);
    byCanalFee.set(k, cur);
  }
  console.log('\nCanal | taxa | qtd | soma');
  for (const [k, v] of [...byCanalFee.entries()].sort((a, b) => b[1].soma - a[1].soma)) {
    const [canal, fee] = k.split('|');
    console.log(`${canal}\t${fee}\t${v.qtd}\t${money(v.soma)}`);
  }

  const ifoodHigh = highFee.filter((h) => h.ifood);
  const ifoodSoma = r2(ifoodHigh.reduce((a, x) => a + x.fee, 0));
  console.log(
    `\niFood com taxa > 6,99: qtd=${ifoodHigh.length} soma=${money(ifoodSoma)}`,
  );

  // Hipótese: 21 × 8,00 = 168
  const ifood8 = ifoodHigh.filter((h) => Math.abs(h.fee - 8) < 1e-9);
  console.log(
    `iFood taxa=8,00: qtd=${ifood8.length} soma=${money(r2(ifood8.length * 8))} (hipótese 21×8=168)`,
  );

  // Combinações que somam ~168
  console.log('\nCandidatos a explicar Δ 168 (subconjuntos por canal/valor):');
  // iFood only fees
  if (Math.abs(ifoodSoma - 168) < 1) {
    console.log(`  ★ soma iFood high ≈ 168 (${money(ifoodSoma)})`);
  }
  // all ifood 8.00
  if (Math.abs(ifood8.length * 8 - 168) < 1) {
    console.log(`  ★ iFood × R$8,00 = ${ifood8.length} × 8 = ${money(ifood8.length * 8)}`);
  }

  // List ifood high fee orders (candidates)
  console.log('\nPedidos iFood taxa > 6,99 (candidatos a NÃO tirar na planilha):');
  console.log('sale_number\tdata\tfee\ttotal\tpartner');
  for (const h of ifoodHigh.sort((a, b) => a.shift_date.localeCompare(b.shift_date) || Number(a.sale_number) - Number(b.sale_number))) {
    console.log(
      `${h.sale_number}\t${h.shift_date}\t${money(h.fee)}\t${money(h.total)}\t${h.partner}`,
    );
  }

  const reent = highFee.filter((h) => h.reentrega);
  console.log(
    `\nReentrega (notes/desc): qtd=${reent.length} soma_taxa=${money(r2(reent.reduce((a, x) => a + x.fee, 0)))}`,
  );
  for (const h of reent.slice(0, 20)) {
    console.log(
      `  ${h.sale_number} ${h.shift_date} fee=${money(h.fee)} partner=${h.partner}`,
    );
  }

  // Non-iFood high fees = what planilha might keep excluding
  const nonIfood = highFee.filter((h) => !h.ifood);
  const nonIfoodSoma = r2(nonIfood.reduce((a, x) => a + x.fee, 0));
  console.log(
    `\nNÃO-iFood taxa > 6,99: qtd=${nonIfood.length} soma=${money(nonIfoodSoma)} (vs planilha ${money(PLANILHA_TAXAS)}, diff=${money(r2(nonIfoodSoma - PLANILHA_TAXAS))})`,
  );

  // --- R$ 34 ---
  console.log('\n=== Busca R$ 34,00 ===');
  const hits34: string[] = [];
  for (const s of sales) {
    if (isCanceledSale(s)) continue;
    const fee = r2(parseMoney(s.delivery?.delivery_fee));
    const total = r2(parseMoney(s.total_amount));
    const disc = r2(parseMoney(s.total_discount));
    if (Math.abs(fee - 34) < 1e-9) {
      hits34.push(
        `TAXA sale=${s.sale_number} ${String(s.shift_date).slice(0, 10)} fee=34 total=${total} partner=${partnerOf(s)}`,
      );
    }
    if (Math.abs(total - 34) < 1e-9) {
      const pays = (s.payments || [])
        .map((p) => `${p?.desc_store_payment_type}=${p?.payment_amount}`)
        .join(', ');
      hits34.push(
        `TOTAL sale=${s.sale_number} ${String(s.shift_date).slice(0, 10)} total=34 fee=${fee} pays=[${pays}] partner=${partnerOf(s)}`,
      );
    }
    for (const p of s.payments || []) {
      const amt = r2(parseMoney(p?.payment_amount));
      if (Math.abs(amt - 34) < 1e-9) {
        hits34.push(
          `PAY sale=${s.sale_number} ${String(s.shift_date).slice(0, 10)} forma="${p?.desc_store_payment_type}" amt=34 total=${total} fee=${fee} partner=${partnerOf(s)}`,
        );
      }
    }
    if (Math.abs(disc - 34) < 1e-9) {
      hits34.push(
        `DISC sale=${s.sale_number} ${String(s.shift_date).slice(0, 10)} discount=34 total=${total} fee=${fee}`,
      );
    }
  }
  if (!hits34.length) console.log('(nenhum hit exato de 34,00)');
  else for (const h of hits34) console.log(h);

  // Breakdown payment amounts for planilha lines
  console.log('\n=== Breakdown formas (consumo/créditos) vs planilha ===');
  const planilhaLinhas = [
    ['6868', 'taxas > 6,99'],
    ['844.9', '?'],
    ['655.7', '?'],
    ['318.6', '?'],
    ['234.7', '?'],
    ['143.8', '?'],
    ['91.8', '?'],
    ['57.1', '?'],
    ['34', '?'],
  ] as const;

  const porForma = new Map<string, number>();
  for (const s of sales) {
    if (isCanceledSale(s)) continue;
    for (const p of s.payments || []) {
      const label = String(p?.desc_store_payment_type || '').trim() || '(vazio)';
      porForma.set(label, r2((porForma.get(label) || 0) + parseMoney(p?.payment_amount)));
    }
  }
  const relevantes = [...porForma.entries()]
    .filter(([f]) => {
      const n = normalizeText(f);
      return (
        n.includes('JANTA') ||
        n.includes('SOCIO') ||
        n.includes('CREDITO CLIENTES') ||
        n.includes('TROCA') ||
        n.includes('COMPLEMENTO') ||
        n.includes('FIADO') ||
        n.includes('MARKETING') ||
        Math.abs((porForma.get(f) || 0) - 34) < 0.05
      );
    })
    .sort((a, b) => b[1] - a[1]);
  for (const [f, v] of relevantes) {
    const matchPlan = planilhaLinhas.find(([, ]) => false) ||
      planilhaLinhas.find(([val]) => Math.abs(Number(val) - v) < 0.05);
    console.log(
      `  ${f}: ${money(v)}${matchPlan ? `  ← casa planilha ${matchPlan[0]}` : ''}`,
    );
  }
}

async function main() {
  console.log('Regra: bruto − taxas>6,99 − créditos − consumo (Sócio+jantas)');
  console.log('FIADO/MARKETING/PAGAMENTO NAO CADASTRADO ficam no líquido\n');

  const ahuSales = (await fetchSalesForCompetencia({
    storeSlug: 'ahu',
    competencia: COMP,
  })) as Sale[];

  await diagAhu(ahuSales);

  const calcAhu = calcularVendaLiquida(ahuSales, DEFAULT_VENDA_LIQUIDA_CONFIG);
  console.log('\n=== Ahú calc regra final vs planilha ===');
  console.log(
    [
      `bruto=${money(calcAhu.vendaBruta)}`,
      `taxas>6,99=${money(calcAhu.taxaEntregaExcluida)}`,
      `créditos=${money(calcAhu.creditosExcluidos)}`,
      `consumo=${money(calcAhu.consumoInterno)}`,
      `líquido=${money(calcAhu.vendaLiquida)}`,
      `planilha=${money(PLANILHA_AHU)}`,
      `diff=${money(r2(calcAhu.vendaLiquida - PLANILHA_AHU))}`,
    ].join(' | '),
  );
  console.log(
    'formas desconhecidas:',
    calcAhu.formasDesconhecidas.join(', ') || '(nenhuma)',
  );

  console.log('\n=== 4 lojas — regra final ===');
  console.log(
    ['loja', 'bruto', 'taxas>6,99', 'créditos', 'consumo', 'líquido_calc'].join(
      '\t',
    ),
  );

  for (const loja of LOJAS) {
    const sales =
      loja === 'ahu'
        ? ahuSales
        : ((await fetchSalesForCompetencia({
            storeSlug: loja,
            competencia: COMP,
          })) as Sale[]);
    const calc = calcularVendaLiquida(sales, DEFAULT_VENDA_LIQUIDA_CONFIG);
    console.log(
      [
        loja,
        money(calc.vendaBruta),
        money(calc.taxaEntregaExcluida),
        money(calc.creditosExcluidos),
        money(calc.consumoInterno),
        money(calc.vendaLiquida),
      ].join('\t'),
    );
  }

  console.log('\nDry-run concluído — nada gravado.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
