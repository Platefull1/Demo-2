/**
 * Unidades vendidas Saipos das 4 SKUs + venda diária Pilarzinho.
 * Uma loja por vez, janela de 1 dia, 3 retries, checkpoint para retomar.
 * npx tsx --env-file=.env scripts/unidades-vendidas-bebidas.ts
 */
import { existsSync, readFileSync, writeFileSync } from 'fs';
import {
  fetchSalesPage,
  type SaiposStoreSlug,
} from '../src/lib/saipos/dataApi';
import {
  isCanceledSale,
  parseMoney,
  parseRefeicaoRegras,
  parseVendaMesConfig,
  valorVendaParaMes,
  type SaiposSaleLike,
} from '../src/lib/cmv-real/refeicoes';
import { PrismaClient } from '@prisma/client';

const OWNER = 'cmk5ykusf0001jz04iwmf8xa8';
const LOJAS: SaiposStoreSlug[] = ['pilarzinho', 'portao', 'uberaba', 'ahu'];
const SKUS = ['COCA 2L', 'COCA 2L ZERO', 'SPRITE 2L', 'SPRITE 2L ZERO'] as const;
type Sku = (typeof SKUS)[number];
const CHECKPOINT = 'scripts/.unidades-vendidas-checkpoint.json';
const PAGE = 1000;
const MAX_RETRIES = 3;

const COMPRAS: Record<string, Record<'set' | 'out', Record<Sku, number>>> = {
  ahu: {
    set: { 'COCA 2L': 660, 'COCA 2L ZERO': 879, 'SPRITE 2L': 96, 'SPRITE 2L ZERO': 132 },
    out: { 'COCA 2L': 1218, 'COCA 2L ZERO': 1200, 'SPRITE 2L': 174, 'SPRITE 2L ZERO': 258 },
  },
  pilarzinho: {
    set: { 'COCA 2L': 800, 'COCA 2L ZERO': 612, 'SPRITE 2L': 72, 'SPRITE 2L ZERO': 60 },
    out: { 'COCA 2L': 540, 'COCA 2L ZERO': 468, 'SPRITE 2L': 78, 'SPRITE 2L ZERO': 90 },
  },
  portao: {
    set: { 'COCA 2L': 408, 'COCA 2L ZERO': 438, 'SPRITE 2L': 66, 'SPRITE 2L ZERO': 96 },
    out: { 'COCA 2L': 522, 'COCA 2L ZERO': 564, 'SPRITE 2L': 24, 'SPRITE 2L ZERO': 66 },
  },
  uberaba: {
    set: { 'COCA 2L': 498, 'COCA 2L ZERO': 450, 'SPRITE 2L': 48, 'SPRITE 2L ZERO': 60 },
    out: { 'COCA 2L': 432, 'COCA 2L ZERO': 324, 'SPRITE 2L': 42, 'SPRITE 2L ZERO': 12 },
  },
};

const prisma = new PrismaClient();

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
  sale: string | number | null;
  sku: Sku;
  qtd: number;
  nome: string;
  unit: number;
  saleTotal: number;
  saleDiscount: number;
};

type Pendente = { loja: string; data: string; erro: string };

type Checkpoint = {
  ok: string[];
  pendentes: Pendente[];
  acc: Record<string, Record<'set' | 'out', Record<Sku, AccSku>>>;
  pilarDia: Record<string, { venda: number; n: number }>;
  brindes: BrindeRow[];
  nomesVistos: Record<string, number>;
};

function emptyCheckpoint(): Checkpoint {
  const acc: Checkpoint['acc'] = {};
  for (const loja of LOJAS) acc[loja] = { set: emptyAcc(), out: emptyAcc() };
  return { ok: [], pendentes: [], acc, pilarDia: {}, brindes: [], nomesVistos: {} };
}

function loadCheckpoint(): Checkpoint {
  if (!existsSync(CHECKPOINT)) return emptyCheckpoint();
  const raw = JSON.parse(readFileSync(CHECKPOINT, 'utf8')) as Checkpoint;
  raw.ok ??= [];
  raw.pendentes ??= [];
  raw.pilarDia ??= {};
  raw.brindes ??= [];
  raw.nomesVistos ??= {};
  if (!raw.acc) raw.acc = emptyCheckpoint().acc;
  return raw;
}

function saveCheckpoint(cp: Checkpoint) {
  writeFileSync(CHECKPOINT, JSON.stringify(cp, null, 2));
}

function periodoDe(data: string): 'set' | 'out' {
  return data <= '2026-09-30' ? 'set' : 'out';
}

function contarItem(item: Record<string, unknown>, itemQty: number): Array<{ sku: Sku; qtd: number }> {
  const choices = Array.isArray(item.choices) ? item.choices : [];
  const fromChoices: Array<{ sku: Sku; qtd: number }> = [];
  for (const ch of choices) {
    if (!ch || typeof ch !== 'object' || deleted((ch as { deleted?: unknown }).deleted)) continue;
    const c = ch as Record<string, unknown>;
    const sku = classificar(String(c.desc_store_choice_item || c.desc_sale_item_choice || ''));
    if (sku) fromChoices.push({ sku, qtd: itemQty });
  }
  if (fromChoices.length) return fromChoices;
  const sku = classificar(String(item.desc_sale_item || item.desc_store_item || ''));
  return sku ? [{ sku, qtd: itemQty }] : [];
}

async function pagina(
  loja: SaiposStoreSlug,
  data: string,
  offset: number,
): Promise<SaiposSaleLike[] | null> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const t0 = Date.now();
      const page = await fetchSalesPage({
        storeSlug: loja,
        startDate: data,
        endDate: data,
        limit: PAGE,
        offset,
      });
      console.log(`  ${loja} ${data} off=${offset} n=${page.length} ${Date.now() - t0}ms`);
      return page as SaiposSaleLike[];
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (attempt === MAX_RETRIES) {
        console.log(`  pendente ${loja} ${data} off=${offset}: ${msg.slice(0, 120)}`);
        return null;
      }
      const wait = 1000 * 2 ** attempt;
      console.log(`  retry ${attempt + 1}/${MAX_RETRIES} ${loja} ${data} wait=${wait} ${msg.slice(0, 80)}`);
      await sleep(wait);
    }
  }
  return null;
}

type DiaAcc = {
  un: Record<Sku, AccSku>;
  pilar?: { venda: number; n: number };
  brindes: BrindeRow[];
  nomes: Record<string, number>;
};

function processarVendas(
  loja: SaiposStoreSlug,
  sales: SaiposSaleLike[],
  regras: ReturnType<typeof parseRefeicaoRegras>,
  vendaCfg: ReturnType<typeof parseVendaMesConfig>,
): DiaAcc {
  const un = emptyAcc();
  const brindes: BrindeRow[] = [];
  const nomes: Record<string, number> = {};
  let pilar: { venda: number; n: number } | undefined;
  if (loja === 'pilarzinho') pilar = { venda: 0, n: 0 };

  for (const sale of sales) {
    if (isCanceledSale(sale)) continue;
    const data = String(sale.shift_date || sale.created_at || '').slice(0, 10);
    if (pilar) {
      pilar.venda += valorVendaParaMes(sale, { regras, config: vendaCfg });
      pilar.n += 1;
    }
    const saleTotal = parseMoney(sale.total_amount);
    const saleDiscount = parseMoney(sale.total_discount);
    const itemsAmount = parseMoney(sale.total_amount_items);
    const saleFree = saleTotal <= 0.009 || (itemsAmount > 0 && saleDiscount + 0.009 >= itemsAmount);
    const items = (sale as { items?: unknown }).items;
    if (!Array.isArray(items)) continue;
    for (const raw of items) {
      if (!raw || typeof raw !== 'object') continue;
      const item = raw as Record<string, unknown>;
      if (deleted(item.deleted)) continue;
      const qtd = parseMoney(item.quantity) || 0;
      if (qtd <= 0) continue;
      const unit = parseMoney(item.unit_price);
      const itemFree = unit <= 0.009 || saleFree;
      for (const h of contarItem(item, qtd)) {
        const nome = String(item.desc_sale_item || '');
        nomes[nome] = (nomes[nome] ?? 0) + h.qtd;
        un[h.sku].un += h.qtd;
        if (itemFree) {
          un[h.sku].brinde += h.qtd;
          brindes.push({
            loja,
            data,
            sale: sale.id_sale ?? sale.sale_number ?? null,
            sku: h.sku,
            qtd: h.qtd,
            nome,
            unit,
            saleTotal,
            saleDiscount,
          });
        }
      }
    }
  }
  return { un, pilar, brindes, nomes };
}

function aplicarDia(cp: Checkpoint, loja: SaiposStoreSlug, data: string, dia: DiaAcc) {
  const per = periodoDe(data);
  for (const sku of SKUS) {
    cp.acc[loja][per][sku].un += dia.un[sku].un;
    cp.acc[loja][per][sku].brinde += dia.un[sku].brinde;
  }
  if (loja === 'pilarzinho' && dia.pilar) {
    cp.pilarDia[data] = {
      venda: Math.round(dia.pilar.venda * 100) / 100,
      n: dia.pilar.n,
    };
  }
  cp.brindes.push(...dia.brindes);
  for (const [k, v] of Object.entries(dia.nomes)) {
    cp.nomesVistos[k] = (cp.nomesVistos[k] ?? 0) + v;
  }
  const k = chave(loja, data);
  if (!cp.ok.includes(k)) cp.ok.push(k);
  cp.pendentes = cp.pendentes.filter((p) => chave(p.loja, p.data) !== k);
}

async function buscarDia(loja: SaiposStoreSlug, data: string): Promise<SaiposSaleLike[] | null> {
  const all: SaiposSaleLike[] = [];
  let offset = 0;
  for (;;) {
    const page = await pagina(loja, data, offset);
    if (page == null) return null;
    all.push(...page);
    if (page.length < PAGE) return all;
    offset += PAGE;
  }
}

async function main() {
  const config = await prisma.nfeConfig.findUnique({ where: { userId: OWNER } });
  const regras = parseRefeicaoRegras(config?.refeicaoRegras);
  const vendaCfg = parseVendaMesConfig(config?.vendaMesConfig);
  const cp = loadCheckpoint();
  const okSet = new Set(cp.ok);
  const datas = [...janelas1('2026-09-01', '2026-09-30'), ...janelas1('2026-10-01', '2026-10-21')];

  for (const loja of LOJAS) {
    for (const data of datas) {
      if (okSet.has(chave(loja, data))) continue;
      const sales = await buscarDia(loja, data);
      if (sales == null) {
        const erro = `falhou após ${MAX_RETRIES} retries`;
        const i = cp.pendentes.findIndex((p) => p.loja === loja && p.data === data);
        const row = { loja, data, erro };
        if (i >= 0) cp.pendentes[i] = row;
        else cp.pendentes.push(row);
        saveCheckpoint(cp);
        continue;
      }
      aplicarDia(cp, loja, data, processarVendas(loja, sales, regras, vendaCfg));
      okSet.add(chave(loja, data));
      saveCheckpoint(cp);
    }
  }

  console.log('=== RESUMO ===');
  console.log({
    ok: cp.ok.length,
    pendentes: cp.pendentes.length,
    esperado: LOJAS.length * datas.length,
  });
  if (cp.pendentes.length) {
    console.log('pendentes');
    for (const p of cp.pendentes) console.log(`  ${p.loja} ${p.data} ${p.erro}`);
  }

  console.log('=== UNIDADES (parcial se houver pendentes) ===');
  for (const loja of LOJAS) {
    console.log(loja);
    for (const sku of SKUS) {
      const s = cp.acc[loja].set[sku];
      const o = cp.acc[loja].out[sku];
      const cs = COMPRAS[loja].set[sku];
      const co = COMPRAS[loja].out[sku];
      console.log(' ', sku, {
        setVend: Number(s.un.toFixed(2)),
        setBrinde: Number(s.brinde.toFixed(2)),
        setComp: cs,
        outVend: Number(o.un.toFixed(2)),
        outBrinde: Number(o.brinde.toFixed(2)),
        outComp: co,
      });
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
