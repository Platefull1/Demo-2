/**
 * Classificação de refeições internas (jantas / sócio) a partir de vendas Saipos.
 * Puro — sem I/O. Regras texto→categoria editáveis via NfeConfig.
 */

export type RefeicaoCategoria =
  | 'BOYS'
  | 'LOJA'
  | 'CENTRAL'
  | 'SEGURANCA'
  | 'SOCIO'
  | 'OUTROS';

export type RefeicaoRegra = {
  /** Substring normalizada a procurar na forma de pagamento (ordem importa). */
  match: string;
  categoria: RefeicaoCategoria;
};

/** Seed inicial (ordem = prioridade). */
export const DEFAULT_REFEICAO_REGRAS: RefeicaoRegra[] = [
  { match: 'SOCIO CALENZANO', categoria: 'SOCIO' },
  { match: 'MOTOBOY', categoria: 'BOYS' },
  { match: 'SEGURANCA', categoria: 'SEGURANCA' },
  { match: 'CENTRAL', categoria: 'CENTRAL' },
  { match: 'LOJA', categoria: 'LOJA' },
  { match: 'BALCAO', categoria: 'LOJA' },
  { match: 'EXPEDICAO', categoria: 'LOJA' },
];

export type SaiposSaleLike = {
  canceled?: string | null;
  total_amount_items?: number | string | null;
  total_amount?: number | string | null;
  total_discount?: number | string | null;
  sale_number?: number | string | null;
  id_sale?: number | string | null;
  shift_date?: string | null;
  created_at?: string | null;
  customer?: { name?: string | null } | null;
  discount_coupon?: { coupon?: string | null } | null;
  delivery?: { delivery_fee?: number | string | null } | null;
  payments?: Array<{ desc_store_payment_type?: string | null }> | null;
  partner_sale?: unknown;
};

export type ClassificacaoRefeicao = {
  categoria: RefeicaoCategoria;
  formaPagamento: string | null;
  consumidor: string | null;
  cupom: string | null;
  valorItens: number;
  saiposSaleId: string;
  data: string; // YYYY-MM-DD (shift_date preferido)
};

export function normalizeText(s: string | null | undefined): string {
  return String(s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/\s+/g, ' ')
    .trim();
}

export function parseMoney(v: unknown): number {
  if (v == null || v === '') return 0;
  if (typeof v === 'number') return Number.isFinite(v) ? v : 0;
  const n = Number(String(v).replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}

export function isCanceledSale(sale: SaiposSaleLike): boolean {
  return String(sale.canceled || '').toUpperCase() === 'Y';
}

function paymentLabels(sale: SaiposSaleLike): string[] {
  const payments = Array.isArray(sale.payments) ? sale.payments : [];
  return payments
    .map((p) => normalizeText(p?.desc_store_payment_type))
    .filter(Boolean);
}

function startsWithJanta(text: string): boolean {
  return text.startsWith('JANTA') || text.startsWith('JANTAR');
}

function containsJanta(text: string): boolean {
  return text.includes('JANTA') || text.includes('JANTAR');
}

function matchCategoria(
  paymentNorm: string,
  regras: RefeicaoRegra[]
): RefeicaoCategoria | null {
  for (const r of regras) {
    const m = normalizeText(r.match);
    if (!m) continue;
    if (paymentNorm.includes(m)) return r.categoria;
  }
  return null;
}

/**
 * Classifica uma venda Saipos como refeição interna, ou null se for venda normal.
 */
export function classificarRefeicao(
  sale: SaiposSaleLike,
  regras: RefeicaoRegra[] = DEFAULT_REFEICAO_REGRAS
): ClassificacaoRefeicao | null {
  if (isCanceledSale(sale)) return null;

  const pays = paymentLabels(sale);
  const customer = normalizeText(sale.customer?.name);
  const cupom = normalizeText(sale.discount_coupon?.coupon);
  const primaryPay = pays[0] || '';

  const isSocioPay = pays.some((p) => p.includes('SOCIO CALENZANO'));
  const isJantaPay = pays.some((p) => startsWithJanta(p));
  const jantaApoio = containsJanta(customer) || containsJanta(cupom);

  if (!isSocioPay && !isJantaPay && !jantaApoio) return null;

  let categoria: RefeicaoCategoria;
  if (isSocioPay) {
    categoria = 'SOCIO';
  } else {
    // Usa a primeira forma de pagamento de janta para casar regras
    const jantaPay =
      pays.find((p) => startsWithJanta(p)) || primaryPay || customer || cupom;
    categoria = matchCategoria(jantaPay, regras) ?? 'OUTROS';
    // SOCIO só via forma de pagamento; se caiu em OUTROS por engano com janta, ok
    if (categoria === 'SOCIO' && !isSocioPay) categoria = 'OUTROS';
  }

  const id = sale.id_sale != null ? String(sale.id_sale) : '';
  if (!id) return null;

  const shift = String(sale.shift_date || sale.created_at || '').slice(0, 10);
  const valorItens = Math.round(parseMoney(sale.total_amount_items) * 100) / 100;

  return {
    categoria,
    formaPagamento: pays[0] ? String(sale.payments?.[0]?.desc_store_payment_type || pays[0]) : null,
    consumidor: sale.customer?.name ? String(sale.customer.name) : null,
    cupom: sale.discount_coupon?.coupon
      ? String(sale.discount_coupon.coupon)
      : null,
    valorItens,
    saiposSaleId: id,
    data: /^\d{4}-\d{2}-\d{2}$/.test(shift) ? shift : new Date().toISOString().slice(0, 10),
  };
}

export type VendaMesConfig = {
  /** Se false, subtrai delivery_fee do total_amount. Default true (usa total_amount). */
  incluirTaxaEntrega: boolean;
  /** Reservado: total_amount já é líquido de descontos. */
  usarTotalLiquido: boolean;
  /** Se false, ignora vendas com partner_sale preenchido (iFood etc.). Default true. */
  incluirIfood: boolean;
};

export const DEFAULT_VENDA_MES_CONFIG: VendaMesConfig = {
  incluirTaxaEntrega: true,
  usarTotalLiquido: true,
  incluirIfood: true,
};

export function parseVendaMesConfig(raw: unknown): VendaMesConfig {
  const o = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  return {
    incluirTaxaEntrega: o.incluirTaxaEntrega !== false,
    usarTotalLiquido: o.usarTotalLiquido !== false,
    incluirIfood: o.incluirIfood !== false,
  };
}

export function parseRefeicaoRegras(raw: unknown): RefeicaoRegra[] {
  if (!Array.isArray(raw) || raw.length === 0) return DEFAULT_REFEICAO_REGRAS;
  const out: RefeicaoRegra[] = [];
  for (const item of raw) {
    const o = item as Record<string, unknown>;
    const match = String(o.match || '').trim();
    const categoria = String(o.categoria || '').toUpperCase() as RefeicaoCategoria;
    if (!match) continue;
    if (
      !['BOYS', 'LOJA', 'CENTRAL', 'SEGURANCA', 'SOCIO', 'OUTROS'].includes(
        categoria
      )
    ) {
      continue;
    }
    out.push({ match, categoria });
  }
  return out.length ? out : DEFAULT_REFEICAO_REGRAS;
}

/** Contribuição da venda para o total do mês (0 se cancelada / refeição / filtrada). */
export function valorVendaParaMes(
  sale: SaiposSaleLike,
  opts: {
    regras?: RefeicaoRegra[];
    config?: VendaMesConfig;
  } = {}
): number {
  if (isCanceledSale(sale)) return 0;
  if (classificarRefeicao(sale, opts.regras)) return 0;

  const config = opts.config ?? DEFAULT_VENDA_MES_CONFIG;
  if (!config.incluirIfood && sale.partner_sale) return 0;

  let total = parseMoney(sale.total_amount);
  if (!config.incluirTaxaEntrega) {
    total -= parseMoney(sale.delivery?.delivery_fee);
  }
  return Math.round(total * 100) / 100;
}

export function resumirRefeicoesPorCategoria(
  items: Array<{ categoria: string; valorItens: number; ignorada?: boolean }>
): Array<{
  categoria: string;
  quantidade: number;
  valorItens: number;
}> {
  const map = new Map<string, { quantidade: number; valorItens: number }>();
  for (const it of items) {
    if (it.ignorada) continue;
    const cur = map.get(it.categoria) || { quantidade: 0, valorItens: 0 };
    cur.quantidade += 1;
    cur.valorItens += it.valorItens;
    map.set(it.categoria, cur);
  }
  return Array.from(map.entries()).map(([categoria, v]) => ({
    categoria,
    quantidade: v.quantidade,
    valorItens: Math.round(v.valorItens * 100) / 100,
  }));
}

/**
 * %CMV MP bruto = consumoMP / vendaMes
 * custo refeição = valorItens * pct
 */
export function calcularCustoRefeicoes(params: {
  consumoMp: number;
  vendaMes: number;
  refeicoes: Array<{ categoria: string; valorItens: number; ignorada?: boolean }>;
}): {
  pctCmvMpBruto: number;
  porCategoria: Array<{
    categoria: string;
    quantidade: number;
    valorItens: number;
    custo: number;
  }>;
  custoTotal: number;
  consumoMpLiquido: number;
} {
  const pct =
    params.vendaMes > 0 ? params.consumoMp / params.vendaMes : 0;
  const ativos = params.refeicoes.filter((r) => !r.ignorada);
  const resumo = resumirRefeicoesPorCategoria(ativos);
  const porCategoria = resumo.map((r) => ({
    ...r,
    custo: Math.round(r.valorItens * pct * 100) / 100,
  }));
  const custoTotal =
    Math.round(porCategoria.reduce((a, x) => a + x.custo, 0) * 100) / 100;
  return {
    pctCmvMpBruto: pct,
    porCategoria,
    custoTotal,
    consumoMpLiquido: Math.round((params.consumoMp - custoTotal) * 100) / 100,
  };
}
