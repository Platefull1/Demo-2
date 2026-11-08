/**
 * Diagnóstico Ahú OUT/2026 — distribuição de taxas de entrega (API).
 * Só dry-run / print. Sem gravar.
 *
 * npx tsx --env-file=.env scripts/diag-taxa-ahu-out-2026.ts
 * npx tsx --env-file=.env scripts/diag-taxa-ahu-out-2026.ts --export="C:\caminho\arquivo.xlsx"
 */
import { fetchSalesForCompetencia } from '../src/lib/saipos/dataApi';
import { isCanceledSale, parseMoney } from '../src/lib/cmv-real/refeicoes';
import type { SaiposSaleVendaLike } from '../src/lib/cmv-real/venda-liquida';
import { readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';

const COMP = '2026-10';
const STORE = 'ahu' as const;

const require = createRequire(import.meta.url);

type Sale = SaiposSaleVendaLike & {
  id_sale_type?: number | string | null;
  partner_sale?: {
    desc_store_partner?: string | null;
    name?: string | null;
  } | null;
  sale_number?: number | string | null;
  id_sale?: number | string | null;
  shift_date?: string | null;
  created_at?: string | null;
  total_amount?: number | string | null;
};

function money(n: number) {
  return n.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function canalOf(sale: Sale): string {
  const partner = sale.partner_sale;
  if (partner) {
    const name = String(
      partner.desc_store_partner || partner.name || 'parceiro',
    ).trim();
    return name || 'parceiro';
  }
  const t = Number(sale.id_sale_type);
  if (t === 1) return 'Delivery próprio';
  if (t === 2) return 'Balcão';
  if (t === 3) return 'Salão';
  if (t === 4) return 'Ficha';
  return `tipo_${sale.id_sale_type ?? '?'}`;
}

function isIfood(sale: Sale): boolean {
  const c = canalOf(sale).toLowerCase();
  return c.includes('ifood') || c.includes('i food');
}

function saleKey(sale: Sale): string {
  const n = sale.sale_number != null ? String(sale.sale_number) : '';
  const d = String(sale.shift_date || '').slice(0, 10);
  return `${d}|${n}`;
}

function parseArgs() {
  const exportArg = process.argv.find((a) => a.startsWith('--export='));
  return {
    exportPath: exportArg ? exportArg.slice('--export='.length).replace(/^["']|["']$/g, '') : null,
  };
}

type ExportRow = {
  saleNumber: string;
  data: string;
  total: number;
  taxa: number;
  canal: string;
  raw: Record<string, unknown>;
};

function normalizeHeader(h: string): string {
  return String(h || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function pickCol(headers: string[], candidates: string[]): number {
  const norms = headers.map(normalizeHeader);
  for (const c of candidates) {
    const cn = normalizeHeader(c);
    const i = norms.findIndex((h) => h === cn || h.includes(cn));
    if (i >= 0) return i;
  }
  return -1;
}

function parseBrNumber(v: unknown): number {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  const s = String(v ?? '').trim();
  if (!s) return 0;
  // 1.234,56 ou 1234.56
  if (/^\d{1,3}(\.\d{3})*,\d+$/.test(s)) {
    return Number(s.replace(/\./g, '').replace(',', '.')) || 0;
  }
  if (s.includes(',') && !s.includes('.')) {
    return Number(s.replace(',', '.')) || 0;
  }
  return Number(s.replace(/[^\d.-]/g, '')) || 0;
}

function parseExportDate(v: unknown): string {
  if (v instanceof Date && !Number.isNaN(v.getTime())) {
    // Excel serial dates often come as Date in local TZ from xlsx
    const y = v.getFullYear();
    const m = String(v.getMonth() + 1).padStart(2, '0');
    const d = String(v.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  if (typeof v === 'number' && Number.isFinite(v)) {
    // Excel serial
    const epoch = Date.UTC(1899, 11, 30);
    const ms = epoch + Math.round(v) * 86400000;
    const dt = new Date(ms);
    return dt.toISOString().slice(0, 10);
  }
  const s = String(v ?? '').trim();
  const br = /^(\d{2})\/(\d{2})\/(\d{4})/.exec(s);
  if (br) return `${br[3]}-${br[2]}-${br[1]}`;
  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;
  return '';
}

function loadExport(path: string): { rows: ExportRow[]; headers: string[]; sheet: string } {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const XLSX = require('xlsx') as typeof import('xlsx');
  if (!existsSync(path)) throw new Error(`Arquivo não encontrado: ${path}`);
  const buf = readFileSync(path);
  const wb = XLSX.read(buf, { type: 'buffer', cellDates: true });
  const sheetName = wb.SheetNames[0];
  const sheet = wb.Sheets[sheetName];
  const matrix = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: '',
    raw: true,
  }) as unknown[][];

  // Acha a linha de cabeçalho (primeira com "pedido" / "venda" / "total")
  let headerIdx = 0;
  for (let i = 0; i < Math.min(matrix.length, 30); i++) {
    const row = (matrix[i] || []).map((c) => normalizeHeader(String(c)));
    const joined = row.join(' | ');
    if (
      (joined.includes('pedido') || joined.includes('venda') || joined.includes('nº') || joined.includes('numero')) &&
      (joined.includes('total') || joined.includes('valor') || joined.includes('taxa'))
    ) {
      headerIdx = i;
      break;
    }
  }

  const headers = (matrix[headerIdx] || []).map((c) => String(c ?? ''));
  const iNum = pickCol(headers, [
    'nº venda',
    'n° venda',
    'numero venda',
    'nº pedido',
    'pedido',
    'venda',
    'sale_number',
    'nº',
  ]);
  const iData = pickCol(headers, [
    'data do turno',
    'data turno',
    'shift date',
    'data',
    'data da venda',
    'data pedido',
  ]);
  const iTotal = pickCol(headers, [
    'total',
    'valor total',
    'total venda',
    'valor do pedido',
    'total_amount',
  ]);
  const iTaxa = pickCol(headers, [
    'taxa de entrega',
    'taxa entrega',
    'delivery fee',
    'frete',
  ]);
  const iCanal = pickCol(headers, [
    'parceiro',
    'canal',
    'origem',
    'tipo de venda',
    'plataforma',
  ]);

  console.log('Export sheet:', sheetName, '| header row:', headerIdx + 1);
  console.log('Colunas detectadas:', {
    saleNumber: iNum >= 0 ? headers[iNum] : null,
    data: iData >= 0 ? headers[iData] : null,
    total: iTotal >= 0 ? headers[iTotal] : null,
    taxa: iTaxa >= 0 ? headers[iTaxa] : null,
    canal: iCanal >= 0 ? headers[iCanal] : null,
  });
  console.log('Headers raw:', headers.filter(Boolean).slice(0, 25).join(' | '));

  const rows: ExportRow[] = [];
  for (let r = headerIdx + 1; r < matrix.length; r++) {
    const line = matrix[r] || [];
    if (!line.some((c) => String(c ?? '').trim())) continue;
    const saleNumber =
      iNum >= 0 ? String(line[iNum] ?? '').trim().replace(/\.0$/, '') : '';
    const data = iData >= 0 ? parseExportDate(line[iData]) : '';
    const total = iTotal >= 0 ? parseBrNumber(line[iTotal]) : 0;
    const taxa = iTaxa >= 0 ? parseBrNumber(line[iTaxa]) : 0;
    const canal = iCanal >= 0 ? String(line[iCanal] ?? '').trim() : '';
    if (!saleNumber && !total) continue;
    const raw: Record<string, unknown> = {};
    headers.forEach((h, idx) => {
      if (h) raw[h] = line[idx];
    });
    rows.push({ saleNumber, data, total, taxa, canal, raw });
  }
  return { rows, headers, sheet: sheetName };
}

async function main() {
  const { exportPath } = parseArgs();

  console.log(`=== 1) Distribuição taxas API — Ahú ${COMP} ===`);
  console.log(
    'Filtro API: p_date_column_filter=shift_date, start=2026-10-01T00:00:00, end=2026-10-31T23:59:59 (sem offset TZ explícito)',
  );

  const sales = (await fetchSalesForCompetencia({
    storeSlug: STORE,
    competencia: COMP,
  })) as Sale[];

  let cancelados = 0;
  let bruto = 0;
  let taxaTotal = 0;
  const bucket = new Map<
    string,
    { fee: number; qtd: number; soma: number; canais: Map<string, number> }
  >();

  const byKey = new Map<string, Sale>();
  const shiftDates = new Set<string>();
  const createdAtSample: string[] = [];

  for (const sale of sales) {
    if (isCanceledSale(sale)) {
      cancelados += 1;
      continue;
    }
    const fee = round2(parseMoney(sale.delivery?.delivery_fee));
    const total = parseMoney(sale.total_amount);
    bruto += total;
    taxaTotal += fee;
    const canal = canalOf(sale);
    const key = fee.toFixed(2);
    const cur = bucket.get(key) || {
      fee,
      qtd: 0,
      soma: 0,
      canais: new Map<string, number>(),
    };
    cur.qtd += 1;
    cur.soma = round2(cur.soma + fee);
    cur.canais.set(canal, (cur.canais.get(canal) || 0) + 1);
    bucket.set(key, cur);

    const sk = saleKey(sale);
    if (sk) byKey.set(sk, sale);
    const sd = String(sale.shift_date || '').slice(0, 10);
    if (sd) shiftDates.add(sd);
    if (createdAtSample.length < 5 && sale.created_at) {
      createdAtSample.push(String(sale.created_at));
    }
  }

  bruto = round2(bruto);
  taxaTotal = round2(taxaTotal);

  const sorted = [...bucket.values()].sort((a, b) => a.fee - b.fee);
  console.log('');
  console.log('valor\tqtd\tsoma\tcanais (qtd)');
  let qtdEntre001e698 = 0;
  let somaEntre001e698 = 0;
  let qtd699 = 0;
  let soma699 = 0;
  let qtdAcima = 0;
  let somaAcima = 0;
  let qtdZero = 0;

  for (const b of sorted) {
    const canais = [...b.canais.entries()]
      .sort((a, c) => c[1] - a[1])
      .map(([c, n]) => `${c}:${n}`)
      .join(', ');
    console.log(`${money(b.fee)}\t${b.qtd}\t${money(b.soma)}\t${canais}`);
    if (b.fee === 0) qtdZero += b.qtd;
    else if (b.fee > 0 && b.fee < 6.99 - 1e-9) {
      qtdEntre001e698 += b.qtd;
      somaEntre001e698 = round2(somaEntre001e698 + b.soma);
    } else if (Math.abs(b.fee - 6.99) < 1e-9) {
      qtd699 += b.qtd;
      soma699 = round2(soma699 + b.soma);
    } else if (b.fee > 6.99) {
      qtdAcima += b.qtd;
      somaAcima = round2(somaAcima + b.soma);
    }
  }

  console.log('');
  console.log('Resumo faixas:');
  console.log(`  taxa = 0:              qtd=${qtdZero}`);
  console.log(
    `  0,01 ≤ taxa ≤ 6,98:   qtd=${qtdEntre001e698}  soma=${money(somaEntre001e698)}`,
  );
  console.log(`  taxa = 6,99:           qtd=${qtd699}  soma=${money(soma699)}`);
  console.log(`  taxa > 6,99:           qtd=${qtdAcima}  soma=${money(somaAcima)}`);
  console.log(
    `  pedidos não cancelados: ${sales.length - cancelados} | cancelados: ${cancelados}`,
  );
  console.log(`  bruto API (total_amount): ${money(bruto)}`);
  console.log(`  taxa total API: ${money(taxaTotal)}`);
  console.log(
    `  taxa excluída pela regra atual (≤6,99): ${money(somaEntre001e698 + soma699)}`,
  );

  // --- 3) Datas / fuso ---
  console.log('');
  console.log('=== 3) Filtro de data / fuso ===');
  const shifts = [...shiftDates].sort();
  console.log(`  shift_date min/max: ${shifts[0]} → ${shifts[shifts.length - 1]}`);
  console.log(`  dias distintos shift_date: ${shifts.length}`);
  console.log(`  created_at amostras: ${createdAtSample.join(' | ') || '(nenhuma)'}`);
  console.log(
    '  Cliente envia T00:00:00 / T23:59:59 SEM timezone. Docs internas usam shift_date civil YYYY-MM-DD.',
  );
  console.log(
    '  Competência montada com Date.UTC (1º–último dia do mês) → strings civis 2026-10-01..31.',
  );

  if (!exportPath) {
    console.log('');
    console.log(
      '=== 2) Export NÃO informado — passe --export="C:\\\\caminho\\\\arquivo.xlsx" ===',
    );
    console.log('Dry-run parcial concluído (só API).');
    return;
  }

  console.log('');
  console.log(`=== 2) Reconciliação com export: ${exportPath} ===`);
  const exp = loadExport(exportPath);

  // Filtra outubro se houver coluna de data
  const expOct = exp.rows.filter((r) => !r.data || r.data.startsWith('2026-10'));
  const exportTotal = round2(expOct.reduce((s, r) => s + r.total, 0));
  const exportTaxa = round2(expOct.reduce((s, r) => s + r.taxa, 0));

  console.log(`  linhas export (out/filtradas): ${expOct.length} (todas: ${exp.rows.length})`);
  console.log(`  total export: ${money(exportTotal)}  |  bruto API: ${money(bruto)}  |  diff: ${money(round2(bruto - exportTotal))}`);
  console.log(`  taxa export:  ${money(exportTaxa)}  |  taxa API:  ${money(taxaTotal)}  |  diff: ${money(round2(taxaTotal - exportTaxa))}`);

  const expByKey = new Map<string, ExportRow>();
  const expByNum = new Map<string, ExportRow[]>();
  for (const r of expOct) {
    const k = `${r.data}|${r.saleNumber}`;
    expByKey.set(k, r);
    if (!expByNum.has(r.saleNumber)) expByNum.set(r.saleNumber, []);
    expByNum.get(r.saleNumber)!.push(r);
  }

  const apiOnly: string[] = [];
  const matched: Array<{ api: Sale; exp: ExportRow }> = [];
  for (const [k, sale] of byKey) {
    const expRow = expByKey.get(k);
    if (expRow) {
      matched.push({ api: sale, exp: expRow });
    } else {
      // fallback: só número
      const num = sale.sale_number != null ? String(sale.sale_number) : '';
      const cands = expByNum.get(num) || [];
      if (cands.length === 1) matched.push({ api: sale, exp: cands[0] });
      else apiOnly.push(k);
    }
  }

  const matchedKeys = new Set(
    matched.map(({ api, exp }) => `${saleKey(api)}::${exp.data}|${exp.saleNumber}`),
  );
  const expOnly: ExportRow[] = [];
  for (const r of expOct) {
    const hit = matched.some(
      (m) =>
        (saleKey(m.api) === `${r.data}|${r.saleNumber}` ||
          String(m.api.sale_number) === r.saleNumber) &&
        m.exp === r,
    );
    if (!hit) expOnly.push(r);
  }

  console.log(`  matchados: ${matched.length}`);
  console.log(`  só na API: ${apiOnly.length} (amostra: ${apiOnly.slice(0, 8).join(', ')})`);
  console.log(
    `  só no export: ${expOnly.length} (amostra: ${expOnly
      .slice(0, 8)
      .map((r) => `${r.data}|${r.saleNumber}`)
      .join(', ')})`,
  );

  // 5 exemplos iFood lado a lado
  const ifoodExamples = matched
    .filter(({ api }) => isIfood(api) && parseMoney(api.delivery?.delivery_fee) > 0)
    .slice(0, 5);

  console.log('');
  console.log('=== iFood: 5 exemplos API x export ===');
  console.log(
    'sale_number\tshift_date\tAPI total\tAPI taxa\tAPI total-taxa\texport total\texport taxa\texport−API\tinclui_699?',
  );
  for (const { api, exp } of ifoodExamples) {
    const apiTotal = parseMoney(api.total_amount);
    const apiFee = parseMoney(api.delivery?.delivery_fee);
    const diff = round2(exp.total - apiTotal);
    const inclui =
      Math.abs(diff) < 0.02
        ? 'export≈API total (taxa já dentro OU ambos sem?)'
        : Math.abs(exp.total - (apiTotal - apiFee)) < 0.02
          ? 'export≈API−taxa (export SEM taxa)'
          : Math.abs(exp.total - (apiTotal + apiFee)) < 0.02
            ? 'export≈API+taxa (export COM taxa extra)'
            : 'não casa';
    console.log(
      [
        api.sale_number,
        String(api.shift_date || '').slice(0, 10),
        money(apiTotal),
        money(apiFee),
        money(round2(apiTotal - apiFee)),
        money(exp.total),
        money(exp.taxa),
        money(diff),
        inclui,
      ].join('\t'),
    );
  }

  if (ifoodExamples.length === 0) {
    console.log('(nenhum iFood matchado com taxa > 0 — ver colunas do export)');
  }

  console.log('');
  console.log('Dry-run concluído — nada gravado.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
