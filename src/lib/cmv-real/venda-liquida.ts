/**
 * Venda líquida mensal a partir de vendas da API de Dados Saipos.
 * Puro — sem I/O.
 *
 * venda_liquida = bruto − taxas > LIMITE − consumo_interno − créditos
 * Taxa = LIMITE (ex.: 6,99 iFood) permanece no líquido.
 * (+ ajuste manual aplicado na persistência / UI).
 */

import {
  isCanceledSale,
  normalizeText,
  parseMoney,
  type SaiposSaleLike,
} from './refeicoes';

export const DEFAULT_LIMITE_TAXA_ENTREGA = 6.99;

/** Formas de consumo interno (jantas + sócio). Comparação via normalizeText / includes. */
export const DEFAULT_FORMAS_CONSUMO_INTERNO = [
  'JANTA CENTRAL',
  'JANTA SEGURANCA',
  'JANTA MOTOBOYS',
  'JANTA LOJA',
  'SOCIO CALENZANO',
] as const;

/** Créditos / trocas / complementos / reentrega — desconta só o payment_amount. */
export const DEFAULT_FORMAS_CREDITOS = [
  'CREDITO CLIENTES',
  'TROCA CLIENTES',
  'COMPLEMENTO CLIENTES',
  'REENTREGA',
] as const;

/** Formas “normais” conhecidas — não disparam alerta WhatsApp. */
export const DEFAULT_FORMAS_CONHECIDAS_EXTRAS = [
  'PAGO ONLINE',
  'PAGAMENTO ONLINE',
  'VOUCHER',
  'IFOOD',
  'DINHEIRO',
  'PIX',
  'CARTAO',
  'CARTÃO',
  'DEBITO',
  'CREDITO',
  'MAQUINETA',
  'VR',
  'VA',
  'ALELO',
  'SODEXO',
  'TICKET',
  'ONLINE',
  'ENTREGA',
  'APP',
  'BOLETO',
  'STONE',
  'CIELLO',
  'CIELO',
  'ELO',
  'SENFF',
  'FIADO',
  'MARKETING',
  'PAGAMENTO NAO CADASTRADO',
] as const;

export type VendaLiquidaConfig = {
  limiteTaxaEntrega: number;
  formasConsumoInterno: string[];
  formasCreditos: string[];
  /** Substrings normalizadas que NÃO disparam alerta de forma desconhecida. */
  formasConhecidasExtras: string[];
};

export const DEFAULT_VENDA_LIQUIDA_CONFIG: VendaLiquidaConfig = {
  limiteTaxaEntrega: DEFAULT_LIMITE_TAXA_ENTREGA,
  formasConsumoInterno: [...DEFAULT_FORMAS_CONSUMO_INTERNO],
  formasCreditos: [...DEFAULT_FORMAS_CREDITOS],
  formasConhecidasExtras: [...DEFAULT_FORMAS_CONHECIDAS_EXTRAS],
};

export type SaiposPaymentLike = {
  desc_store_payment_type?: string | null;
  payment_amount?: number | string | null;
};

export type SaiposSaleVendaLike = SaiposSaleLike & {
  payments?: SaiposPaymentLike[] | null;
};

export type JantaComValor = {
  idSale: string;
  saleNumber: string | null;
  data: string;
  formaPagamento: string;
  valor: number;
};

export type VendaLiquidaResultado = {
  vendaBruta: number;
  taxaEntregaExcluida: number;
  consumoInterno: number;
  creditosExcluidos: number;
  vendaLiquida: number;
  limiteTaxa: number;
  totalPedidos: number;
  pedidosCancelados: number;
  /** Valores distintos de delivery_fee > limite (excluídos da líquida). */
  taxasAcimaLimiteDistintas: number[];
  jantasComValor: JantaComValor[];
  /** Formas normalizadas vistas que não casam em nenhuma lista conhecida. */
  formasDesconhecidas: string[];
};

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function matchLista(normPay: string, lista: string[]): boolean {
  for (const raw of lista) {
    const m = normalizeText(raw);
    if (!m) continue;
    if (normPay.includes(m) || m.includes(normPay)) return true;
  }
  return false;
}

function isFormaConhecida(normPay: string, cfg: VendaLiquidaConfig): boolean {
  if (matchLista(normPay, cfg.formasConsumoInterno)) return true;
  if (matchLista(normPay, cfg.formasCreditos)) return true;
  if (matchLista(normPay, cfg.formasConhecidasExtras)) return true;
  // Janta* genérico (ex.: "Janta Extra") conta como conhecida p/ alerta
  if (normPay.startsWith('JANTA') || normPay.startsWith('JANTAR')) return true;
  return false;
}

export function parseVendaLiquidaConfig(raw: unknown): VendaLiquidaConfig {
  const o = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const limite =
    typeof o.limiteTaxaEntrega === 'number' && Number.isFinite(o.limiteTaxaEntrega)
      ? o.limiteTaxaEntrega
      : typeof o.limiteTaxaEntrega === 'string'
        ? parseMoney(o.limiteTaxaEntrega) || DEFAULT_LIMITE_TAXA_ENTREGA
        : DEFAULT_LIMITE_TAXA_ENTREGA;

  const asList = (v: unknown, fallback: readonly string[]): string[] => {
    if (!Array.isArray(v) || v.length === 0) return [...fallback];
    return v.map((x) => String(x || '').trim()).filter(Boolean);
  };

  return {
    limiteTaxaEntrega: limite > 0 ? limite : DEFAULT_LIMITE_TAXA_ENTREGA,
    formasConsumoInterno: asList(o.formasConsumoInterno, DEFAULT_FORMAS_CONSUMO_INTERNO),
    formasCreditos: asList(o.formasCreditos, DEFAULT_FORMAS_CREDITOS),
    formasConhecidasExtras: asList(
      o.formasConhecidasExtras,
      DEFAULT_FORMAS_CONHECIDAS_EXTRAS,
    ),
  };
}

/**
 * Mescla vendaMesConfig legado + chaves de venda líquida.
 * Env CMV_LIMITE_TAXA_ENTREGA sobrescreve o limite se numérico.
 */
export function resolveVendaLiquidaConfig(
  vendaMesConfigJson: unknown,
  envLimite?: string | undefined,
): VendaLiquidaConfig {
  const fromJson = parseVendaLiquidaConfig(vendaMesConfigJson);
  if (envLimite != null && String(envLimite).trim() !== '') {
    const n = parseMoney(envLimite);
    if (n > 0) fromJson.limiteTaxaEntrega = n;
  }
  return fromJson;
}

export function calcularVendaLiquida(
  sales: SaiposSaleVendaLike[],
  config: VendaLiquidaConfig = DEFAULT_VENDA_LIQUIDA_CONFIG,
): VendaLiquidaResultado {
  let vendaBruta = 0;
  let taxaEntregaExcluida = 0;
  let consumoInterno = 0;
  let creditosExcluidos = 0;
  let totalPedidos = 0;
  let pedidosCancelados = 0;

  const taxasSet = new Set<number>();
  const jantasComValor: JantaComValor[] = [];
  const formasDescSet = new Set<string>();

  for (const sale of sales) {
    if (isCanceledSale(sale)) {
      pedidosCancelados += 1;
      continue;
    }
    totalPedidos += 1;

    const total = parseMoney(sale.total_amount);
    vendaBruta += total;

    const fee = parseMoney(sale.delivery?.delivery_fee);
    // Só taxa ACIMA do limite sai da líquida; =LIMITE (ex. 6,99 iFood) fica.
    if (fee > config.limiteTaxaEntrega + 1e-9) {
      taxaEntregaExcluida += fee;
      taxasSet.add(round2(fee));
    }

    const payments = Array.isArray(sale.payments) ? sale.payments : [];
    for (const p of payments) {
      const label = String(p?.desc_store_payment_type || '').trim();
      const norm = normalizeText(label);
      if (!norm) continue;
      const amount = round2(parseMoney(p?.payment_amount));

      if (matchLista(norm, config.formasConsumoInterno)) {
        consumoInterno += amount;
        // Lista de apoio: só jantas com valor > 0 (sócio entra no consumo, não nesta lista)
        if (
          amount > 0 &&
          (norm.startsWith('JANTA') || norm.startsWith('JANTAR'))
        ) {
          const shift = String(sale.shift_date || sale.created_at || '').slice(0, 10);
          jantasComValor.push({
            idSale: sale.id_sale != null ? String(sale.id_sale) : '',
            saleNumber:
              sale.sale_number != null ? String(sale.sale_number) : null,
            data: /^\d{4}-\d{2}-\d{2}$/.test(shift) ? shift : '',
            formaPagamento: label,
            valor: amount,
          });
        }
      } else if (matchLista(norm, config.formasCreditos)) {
        creditosExcluidos += amount;
      } else if (!isFormaConhecida(norm, config)) {
        formasDescSet.add(norm);
      }
    }
  }

  vendaBruta = round2(vendaBruta);
  taxaEntregaExcluida = round2(taxaEntregaExcluida);
  consumoInterno = round2(consumoInterno);
  creditosExcluidos = round2(creditosExcluidos);
  const vendaLiquida = round2(
    vendaBruta - taxaEntregaExcluida - consumoInterno - creditosExcluidos,
  );

  return {
    vendaBruta,
    taxaEntregaExcluida,
    consumoInterno,
    creditosExcluidos,
    vendaLiquida,
    limiteTaxa: config.limiteTaxaEntrega,
    totalPedidos,
    pedidosCancelados,
    taxasAcimaLimiteDistintas: [...taxasSet].sort((a, b) => a - b),
    jantasComValor,
    formasDesconhecidas: [...formasDescSet].sort(),
  };
}

export type AjusteVendaMes = {
  valor: number;
  motivo: string;
  criadoPorId: string;
  criadoEm: string;
};

export type VendaMesDetalhe = {
  vendaBruta: number;
  taxaEntregaExcluida: number;
  consumoInterno: number;
  creditosExcluidos: number;
  vendaLiquida: number;
  calculadoEm: string;
  limiteTaxa: number;
  taxasAcimaLimiteDistintas: number[];
  jantasComValor: JantaComValor[];
  formasDesconhecidas: string[];
  ajusteVenda: AjusteVendaMes | null;
};

export function vendaMesEfetiva(detalhe: VendaMesDetalhe | null | undefined): number | null {
  if (!detalhe) return null;
  const adj = detalhe.ajusteVenda?.valor ?? 0;
  return round2(detalhe.vendaLiquida + adj);
}

export function parseVendaMesDetalhe(raw: unknown): VendaMesDetalhe | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  if (typeof o.vendaLiquida !== 'number') return null;
  const adj = o.ajusteVenda;
  let ajusteVenda: AjusteVendaMes | null = null;
  if (adj && typeof adj === 'object') {
    const a = adj as Record<string, unknown>;
    if (
      typeof a.valor === 'number' &&
      typeof a.motivo === 'string' &&
      a.motivo.trim() &&
      typeof a.criadoPorId === 'string'
    ) {
      ajusteVenda = {
        valor: a.valor,
        motivo: String(a.motivo),
        criadoPorId: String(a.criadoPorId),
        criadoEm: String(a.criadoEm || new Date().toISOString()),
      };
    }
  }
  return {
    vendaBruta: Number(o.vendaBruta) || 0,
    taxaEntregaExcluida: Number(o.taxaEntregaExcluida) || 0,
    consumoInterno: Number(o.consumoInterno) || 0,
    creditosExcluidos: Number(o.creditosExcluidos) || 0,
    vendaLiquida: Number(o.vendaLiquida) || 0,
    calculadoEm: String(o.calculadoEm || ''),
    limiteTaxa: Number(o.limiteTaxa) || DEFAULT_LIMITE_TAXA_ENTREGA,
    taxasAcimaLimiteDistintas: Array.isArray(o.taxasAcimaLimiteDistintas)
      ? o.taxasAcimaLimiteDistintas.map((x) => Number(x)).filter((n) => Number.isFinite(n))
      : Array.isArray(o.taxasAteLimiteDistintas)
        ? o.taxasAteLimiteDistintas.map((x) => Number(x)).filter((n) => Number.isFinite(n))
        : [],
    jantasComValor: Array.isArray(o.jantasComValor)
      ? (o.jantasComValor as JantaComValor[])
      : [],
    formasDesconhecidas: Array.isArray(o.formasDesconhecidas)
      ? o.formasDesconhecidas.map(String)
      : [],
    ajusteVenda,
  };
}

/** Monta VendaMesDetalhe a partir do resultado do cálculo, preservando ajuste anterior. */
export function buildVendaMesDetalhe(
  calc: VendaLiquidaResultado,
  ajusteVenda: AjusteVendaMes | null = null,
  calculadoEm: string = new Date().toISOString(),
): VendaMesDetalhe {
  return {
    vendaBruta: calc.vendaBruta,
    taxaEntregaExcluida: calc.taxaEntregaExcluida,
    consumoInterno: calc.consumoInterno,
    creditosExcluidos: calc.creditosExcluidos,
    vendaLiquida: calc.vendaLiquida,
    calculadoEm,
    limiteTaxa: calc.limiteTaxa,
    taxasAcimaLimiteDistintas: calc.taxasAcimaLimiteDistintas,
    jantasComValor: calc.jantasComValor,
    formasDesconhecidas: calc.formasDesconhecidas,
    ajusteVenda,
  };
}
