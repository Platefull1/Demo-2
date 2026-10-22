/**
 * Unidades via GET /sales_items (search_sales não traz items).
 * npx tsx --env-file=.env scripts/unidades-vendidas-itens.ts
 */
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { getSaiposDataToken, type SaiposStoreSlug } from '../src/lib/saipos/dataApi';

const LOJAS: SaiposStoreSlug[] = ['pilarzinho', 'portao', 'uberaba', 'ahu'];
const SKUS = ['COCA 2L', 'COCA 2L ZERO', 'SPRITE 2L', 'SPRITE 2L ZERO'] as const;
type Sku = (typeof SKUS)[number];
const CHECKPOINT = 'scripts/.unidades-vendidas-itens-checkpoint.json';
const PAGE = 1000;
const MAX_RETRIES = 3;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function janelas1(start: string, end: string) {
  const out: string[] = [];
  const cur = new Date(`${start}T00:00:00.000Z`);
  const last = new Date(`${end}T00:00:00.000Z`);
  while (cur <= last) {
    out.push(cur.toISOString().slice(0, 10));
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return out;
}

function chave(loja: string, data: string) {
  return `${loja}|${data}`;
}

function norm(s: string) {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/COCA[\s-]*COLA/g, 'COCA')
    .replace(/\s+/g, ' ')
    .trim();
}

function is2l(u: string) {
  return /(?<![0-9.,])2(\s|,)?L(ITROS?)?\b/.test(u) || /\b2L\b/.test(u);
}

function classificar(nome: string): Sku | null {
  const u = norm(nome);
  if (!u || !is2l(u)) return null;
  const zero = /\bZERO\b/.test(u);
  if (/\bSPRITE\b/.test(u)) return zero ? 'SPRITE 2L ZERO' : 'SPRITE 2L';
  if (/\bCOCA\b/.test(u)) return zero ? 'COCA 2L ZERO' : 'COCA 2L';
  return null;
}

function deleted(v: unknown) {
  return v === true || String(v || '').toUpperCase() === 'Y';
}

function money(v: unknown) {
  if (v == null || v === '') return 0;
  const n = typeof v === 'number' ? v : Number(String(v).replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}

type AccSku = { un: number; brinde: number };
function emptyAcc(): Record<Sku, AccSku> {
  return {
    'COCA 2L': { un: 0, brinde: 0 },
    'COCA 2L ZERO': { un: 0, brinde: 0 },
    'SPRITE 2L': { un: 0, brinde: 0 },
    'SPRITE 2L ZERO': { un: 0, brinde: 0 },
  };
}

type BrindeRow = {
  loja: string;
  data: string;
  sale: unknown;
  sku: Sku;
  qtd: number;
  nome: string;
  unit: number;
};

type Checkpoint = {
  ok: string[];
  pendentes: Array<{ loja: string; data: string; erro: string }>;
  acc: Record<string, Record<'set' | 'out', Record<Sku, AccSku>>>;
  brindes: BrindeRow[];
  nomesVistos: Record<string, number>;
};

function emptyCheckpoint(): Checkpoint {
  const acc: Checkpoint['acc'] = {};
  for (const loja of LOJAS) acc[loja] = { set: emptyAcc(), out: emptyAcc() };
  return { ok: [], pendentes: [], acc, brindes: [], nomesVistos: {} };
}

function loadCheckpoint(): Checkpoint {
  if (!existsSync(CHECKPOINT)) return emptyCheckpoint();
  return { ...emptyCheckpoint(), ...JSON.parse(readFileSync(CHECKPOINT, 'utf8')) };
}

function saveCheckpoint(cp: Checkpoint) {
  writeFileSync(CHECKPOINT, JSON.stringify(cp, null, 2));
}

function periodoDe(data: string): 'set' | 'out' {
  return data <= '2026-09-30' ? 'set' : 'out';
}

async function fetchPage(loja: SaiposStoreSlug, data: string, offset: number): Promise<unknown[] | null> {
  const token = getSaiposDataToken(loja);
  const qs = new URLSearchParams({
    p_date_column_filter: 'shift_date',
    p_filter_date_start: `${data}T00:00:00`,
    p_filter_date_end: `${data}T23:59:59`,
    p_limit: String(PAGE),
    p_offset: String(offset),
  });
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const t0 = Date.now();
      const res = await fetch(`https://data.saipos.io/v1/sales_items?${qs}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      });
      if (!res.ok) {
        const body = await res.text();
        throw new Error(`HTTP ${res.status}: ${body.slice(0, 120)}`);
      }
      const json = await res.json();
      const page = Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : [];
      console.log(`  ${loja} ${data} off=${offset} n=${page.length} ${Date.now() - t0}ms`);
      return page;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (attempt === MAX_RETRIES) {
        console.log(`  pendente ${loja} ${data}: ${msg.slice(0, 120)}`);
        return null;
      }
      const wait = 1000 * 2 ** attempt;
      console.log(`  retry ${attempt + 1}/${MAX_RETRIES} ${loja} ${data} wait=${wait}`);
      await sleep(wait);
    }
  }
  return null;
}

function contarSale(loja: string, data: string, sale: Record<string, unknown>) {
  const hits: Array<{ sku: Sku; qtd: number; nome: string; unit: number; brinde: boolean; sale: unknown }> = [];
  const items = Array.isArray(sale.items) ? sale.items : [];
  for (const raw of items) {
    if (!raw || typeof raw !== 'object' || deleted((raw as { deleted?: unknown }).deleted)) continue;
    const item = raw as Record<string, unknown>;
    const qtd = money(item.quantity);
    if (qtd <= 0) continue;
    const unit = money(item.unit_price);
    const choices = Array.isArray(item.choices) ? item.choices : [];
    const fromChoices: Sku[] = [];
    for (const ch of choices) {
      if (!ch || typeof ch !== 'object' || deleted((ch as { deleted?: unknown }).deleted)) continue;
      const c = ch as Record<string, unknown>;
      const sku = classificar(String(c.desc_store_choice_item || c.desc_sale_item_choice || ''));
      if (sku) fromChoices.push(sku);
    }
    const nome = String(item.desc_sale_item || '');
    const skus = fromChoices.length ? fromChoices : classificar(nome) ? [classificar(nome)!] : [];
    const brinde = unit <= 0.009;
    for (const sku of skus) {
      hits.push({ sku, qtd, nome, unit, brinde, sale: sale.id_sale });
    }
  }
  return hits;
}

async function buscarDia(loja: SaiposStoreSlug, data: string): Promise<unknown[] | null> {
  const all: unknown[] = [];
  let offset = 0;
  for (;;) {
    const page = await fetchPage(loja, data, offset);
    if (page == null) return null;
    all.push(...page);
    if (page.length < PAGE) return all;
    offset += PAGE;
  }
}

async function main() {
  const cp = loadCheckpoint();
  const okSet = new Set(cp.ok);
  const datas = [...janelas1('2026-09-01', '2026-09-30'), ...janelas1('2026-10-01', '2026-10-21')];

  for (const loja of LOJAS) {
    for (const data of datas) {
      if (okSet.has(chave(loja, data))) continue;
      const sales = await buscarDia(loja, data);
      if (sales == null) {
        const row = { loja, data, erro: `falhou após ${MAX_RETRIES} retries` };
        const i = cp.pendentes.findIndex((p) => p.loja === loja && p.data === data);
        if (i >= 0) cp.pendentes[i] = row;
        else cp.pendentes.push(row);
        saveCheckpoint(cp);
        continue;
      }
      const per = periodoDe(data);
      for (const raw of sales) {
        if (!raw || typeof raw !== 'object') continue;
        for (const h of contarSale(loja, data, raw as Record<string, unknown>)) {
          cp.acc[loja][per][h.sku].un += h.qtd;
          cp.nomesVistos[h.nome] = (cp.nomesVistos[h.nome] ?? 0) + h.qtd;
          if (h.brinde) {
            cp.acc[loja][per][h.sku].brinde += h.qtd;
            if (cp.brindes.length < 200) {
              cp.brindes.push({
                loja,
                data,
                sale: h.sale,
                sku: h.sku,
                qtd: h.qtd,
                nome: h.nome,
                unit: h.unit,
              });
            }
          }
        }
      }
      const k = chave(loja, data);
      if (!cp.ok.includes(k)) cp.ok.push(k);
      cp.pendentes = cp.pendentes.filter((p) => chave(p.loja, p.data) !== k);
      okSet.add(k);
      saveCheckpoint(cp);
    }
  }

  console.log('=== RESUMO ITENS ===');
  console.log({ ok: cp.ok.length, pendentes: cp.pendentes.length, esperado: LOJAS.length * datas.length });
  if (cp.pendentes.length) {
    for (const p of cp.pendentes) console.log(`  ${p.loja} ${p.data} ${p.erro}`);
  }
  console.log('=== UNIDADES ===');
  console.log(JSON.stringify(cp.acc, null, 2));
  console.log('=== BRINDES ===', cp.brindes.length);
  console.log(JSON.stringify(cp.brindes.slice(0, 30), null, 2));
  console.log(
    '=== NOMES TOP ===',
    Object.entries(cp.nomesVistos)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
