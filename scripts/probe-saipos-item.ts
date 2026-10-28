import { fetchSalesPage } from '../src/lib/saipos/dataApi';

async function main() {
  const t = Date.now();
  const p = await fetchSalesPage({
    storeSlug: 'pilarzinho',
    startDate: '2026-10-21',
    endDate: '2026-10-21',
    limit: 30,
  });
  console.log('ok', p.length, Date.now() - t);
  const s = p[0] as Record<string, unknown> | undefined;
  console.log('keys', s ? Object.keys(s) : []);
  const items = (s?.items as unknown[]) || [];
  console.log('hasItems', Array.isArray(s?.items), 'nItems', items.length);
  if (items[0]) console.log(JSON.stringify(items[0]).slice(0, 800));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
