import { getSaiposDataToken } from '../src/lib/saipos/dataApi';

async function main() {
  const token = getSaiposDataToken('pilarzinho');
  const qs = new URLSearchParams({
    p_date_column_filter: 'shift_date',
    p_filter_date_start: '2026-10-21T00:00:00',
    p_filter_date_end: '2026-10-21T23:59:59',
    p_limit: '20',
    p_offset: '0',
  });
  const t0 = Date.now();
  const res = await fetch(`https://data.saipos.io/v1/sales_items?${qs}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
  });
  const text = await res.text();
  console.log('status', res.status, Date.now() - t0, text.slice(0, 400));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
