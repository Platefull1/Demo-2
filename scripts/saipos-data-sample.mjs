/**
 * Amostra anonimizada da API de Dados (Consultar Vendas).
 * Uso: node --env-file=.env scripts/saipos-data-sample.mjs
 *
 * Requer SAIPOS_DATA_TOKEN_AHU no .env.
 * Busca Ahú em 01–10/10/2026 e imprime 1 janta, 1 sócio e 1 venda normal.
 */

const BASE_URL = 'https://data.saipos.io/v1';

function norm(s) {
  return String(s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function paymentNames(sale) {
  const payments = Array.isArray(sale?.payments) ? sale.payments : [];
  return payments.map((p) => norm(p?.desc_store_payment_type));
}

function isJanta(sale) {
  const pays = paymentNames(sale);
  if (pays.some((p) => p.startsWith('JANTA') || p.startsWith('JANTAR'))) return true;
  const customer = norm(sale?.customer?.name);
  const coupon = norm(sale?.discount_coupon?.coupon);
  return (
    customer.includes('JANTA') ||
    customer.includes('JANTAR') ||
    coupon.includes('JANTA') ||
    coupon.includes('JANTAR')
  );
}

function isSocio(sale) {
  return paymentNames(sale).some((p) => p.includes('SOCIO CALENZANO'));
}

function isCanceled(sale) {
  return String(sale?.canceled || '').toUpperCase() === 'Y';
}

function anonymize(sale, label) {
  const payments = Array.isArray(sale?.payments) ? sale.payments : [];
  return {
    _sample: label,
    id_sale: sale?.id_sale != null ? `[id:${String(sale.id_sale).slice(-4)}]` : null,
    sale_number: sale?.sale_number ?? null,
    shift_date: sale?.shift_date ?? null,
    created_at: sale?.created_at ?? null,
    canceled: sale?.canceled ?? null,
    id_sale_type: sale?.id_sale_type ?? null,
    total_amount_items: sale?.total_amount_items ?? null,
    total_discount: sale?.total_discount ?? null,
    total_increase: sale?.total_increase ?? null,
    total_amount: sale?.total_amount ?? null,
    discount_reason: sale?.discount_reason ?? null,
    customer_name: sale?.customer?.name
      ? `[cliente:${norm(sale.customer.name).slice(0, 12)}…]`
      : null,
    discount_coupon: sale?.discount_coupon
      ? {
          coupon: sale.discount_coupon.coupon ?? null,
          type: sale.discount_coupon.type ?? null,
          discount: sale.discount_coupon.discount ?? null,
        }
      : null,
    delivery_fee: sale?.delivery?.delivery_fee ?? null,
    payments: payments.map((p) => ({
      desc_store_payment_type: p?.desc_store_payment_type ?? null,
      payment_amount: p?.payment_amount ?? null,
    })),
    // chaves de topo disponíveis neste registro
    top_level_keys: Object.keys(sale || {}).sort(),
    nested_keys: {
      customer: sale?.customer ? Object.keys(sale.customer).sort() : null,
      discount_coupon: sale?.discount_coupon
        ? Object.keys(sale.discount_coupon).sort()
        : null,
      delivery: sale?.delivery ? Object.keys(sale.delivery).sort() : null,
      payments_item: payments[0] ? Object.keys(payments[0]).sort() : null,
    },
  };
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchPage(token, start, end, offset = 0, attempt = 1) {
  const qs = new URLSearchParams({
    p_date_column_filter: 'shift_date',
    p_filter_date_start: `${start}T00:00:00`,
    p_filter_date_end: `${end}T23:59:59`,
    p_limit: '1000',
    p_offset: String(offset),
  });
  const res = await fetch(`${BASE_URL}/search_sales?${qs}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
  });
  if ((res.status >= 500 || res.status === 429) && attempt < 4) {
    const wait = 1500 * attempt;
    console.warn(`HTTP ${res.status} — retry ${attempt}/3 em ${wait}ms…`);
    await sleep(wait);
    return fetchPage(token, start, end, offset, attempt + 1);
  }
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`HTTP ${res.status}: ${t.slice(0, 300)}`);
  }
  const json = await res.json();
  return Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : [];
}

async function fetchWindow(token, start, end) {
  let offset = 0;
  const all = [];
  for (;;) {
    const page = await fetchPage(token, start, end, offset);
    all.push(...page);
    console.log(`  ${start}→${end} offset=${offset}: ${page.length} (acum ${all.length})`);
    if (page.length < 1000) break;
    offset += 1000;
    await sleep(800);
  }
  return all;
}

async function main() {
  const token = (process.env.SAIPOS_DATA_TOKEN_AHU || '').replace(/^Bearer\s+/i, '').trim();
  if (!token) {
    console.error('SAIPOS_DATA_TOKEN_AHU ausente no ambiente.');
    process.exit(1);
  }
  console.log(`Token Ahú prefixo: ${token.slice(0, 4)}…`);

  // Janelas curtas cobrindo os casos reais (sócio 04/10, janta 08/10)
  const windows = [
    ['2026-10-04', '2026-10-04'],
    ['2026-10-08', '2026-10-08'],
  ];
  const all = [];
  for (const [start, end] of windows) {
    all.push(...(await fetchWindow(token, start, end)));
  }

  const active = all.filter((s) => !isCanceled(s));
  // Preferir os casos citados no brief (nº 217 / 13) se existirem
  const janta =
    active.find((s) => isJanta(s) && String(s.sale_number) === '217') ||
    active.find(isJanta);
  const socio =
    active.find((s) => isSocio(s) && String(s.sale_number) === '13') ||
    active.find(isSocio);
  const normal = active.find((s) => !isJanta(s) && !isSocio(s));

  const out = {
    period: { windows, total: all.length, active: active.length },
    found: {
      janta: Boolean(janta),
      socio: Boolean(socio),
      normal: Boolean(normal),
      janta_sale_number: janta?.sale_number ?? null,
      socio_sale_number: socio?.sale_number ?? null,
    },
    samples: {
      janta: janta ? anonymize(janta, 'janta') : null,
      socio: socio ? anonymize(socio, 'socio') : null,
      normal: normal ? anonymize(normal, 'normal') : null,
    },
  };

  console.log(JSON.stringify(out, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
