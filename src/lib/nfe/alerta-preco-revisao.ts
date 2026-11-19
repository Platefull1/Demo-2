/**
 * Alerta de aumento de preço na revisão de NF-e.
 * Compara o custo unitário atual (R$/kg ou R$/un) com as últimas notas do mesmo item.
 *
 * Importante: só usa histórico cuja descrição é compatível com a da nota atual,
 * para não comparar produtos errados (ex.: KitKat × recheio de morango).
 */

import { tokenizeNfeDescricao, tokenRatio } from './similarity';

export const ALERTA_PRECO_DELTA_REAIS = 3;
export const ALERTA_PRECO_HISTORICO_NOTAS = 5;
/** Mínimo de notas anteriores compatíveis para disparar alerta. */
export const ALERTA_PRECO_MIN_AMOSTRAS = 2;

export type HistoricoCustoEntry = {
  custo: number;
  descricao: string;
  notaId: string;
};

export type AlertaPrecoRevisao = {
  ativo: boolean;
  custoAtual: number;
  referencia: number;
  delta: number;
  amostras: number;
  /** Texto no mesmo tom do "Confira o peso". */
  mensagem: string;
};

const GENERICA_HIST = new Set([
  'QUEIJO',
  'CREME',
  'MOLHO',
  'CARNE',
  'RECHEIO',
  'COBERTURA',
  'COB',
  'DOCE',
  'BISCOITO',
  'BISC',
  'BOLACHA',
]);

/** Mediana de uma lista (cópia ordenada). */
export function mediana(valores: number[]): number | null {
  const xs = valores.filter((v) => Number.isFinite(v) && v > 0).sort((a, b) => a - b);
  if (xs.length === 0) return null;
  const mid = Math.floor(xs.length / 2);
  if (xs.length % 2 === 1) return xs[mid]!;
  return (xs[mid - 1]! + xs[mid]!) / 2;
}

/**
 * Duas descrições de NF são o mesmo produto (ou família) se compartilham
 * token distintivo (ex.: NEGRESCO, KITKAT) — não só palavras genéricas.
 */
export function descricoesCompativeisParaPreco(
  descricaoAtual: string,
  descricaoHistorica: string,
): boolean {
  const atual = tokenizeNfeDescricao(descricaoAtual);
  const hist = tokenizeNfeDescricao(descricaoHistorica);
  if (atual.length === 0 || hist.length === 0) return false;

  const shared: string[] = [];
  for (const a of atual) {
    for (const h of hist) {
      if (tokenRatio(a, h) >= 0.8) {
        shared.push(a);
        break;
      }
    }
  }
  if (shared.length === 0) return false;

  const distintivos = shared.filter((t) => t.length >= 5 && !GENERICA_HIST.has(t));
  if (distintivos.length >= 1) return true;
  // Sem marca/sabor distintivo: exige ≥2 tokens em comum (e pelo menos 1 não genérico)
  const naoGenericos = shared.filter((t) => !GENERICA_HIST.has(t));
  return shared.length >= 2 && naoGenericos.length >= 1;
}

export function filtrarHistoricoCompativel(
  descricaoAtual: string,
  historico: HistoricoCustoEntry[],
  limite = ALERTA_PRECO_HISTORICO_NOTAS,
): number[] {
  const out: number[] = [];
  const seenNota = new Set<string>();
  for (const h of historico) {
    if (out.length >= limite) break;
    if (!Number.isFinite(h.custo) || h.custo <= 0) continue;
    if (seenNota.has(h.notaId)) continue;
    if (!descricoesCompativeisParaPreco(descricaoAtual, h.descricao)) continue;
    seenNota.add(h.notaId);
    out.push(h.custo);
  }
  return out;
}

/**
 * Dispara alerta quando o custo atual está ≥ R$ 3 acima da mediana das últimas notas.
 * Usa delta absoluto (não %), para também pegar aumento relevante em itens baratos.
 */
export function deveAlertarPreco(params: {
  custoAtual: number;
  historico: number[];
  deltaMinimo?: number;
  minAmostras?: number;
}): { ativo: boolean; referencia: number | null; delta: number } {
  const deltaMin = params.deltaMinimo ?? ALERTA_PRECO_DELTA_REAIS;
  const minAmostras = params.minAmostras ?? ALERTA_PRECO_MIN_AMOSTRAS;
  if (params.historico.length < minAmostras) {
    return { ativo: false, referencia: mediana(params.historico), delta: 0 };
  }
  const ref = mediana(params.historico);
  if (ref == null || !Number.isFinite(params.custoAtual) || params.custoAtual <= 0) {
    return { ativo: false, referencia: ref, delta: 0 };
  }
  const delta = params.custoAtual - ref;
  return {
    ativo: delta >= deltaMin,
    referencia: ref,
    delta,
  };
}

function fmtMoney(n: number): string {
  return n.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function textoAlertaPrecoRevisao(params: {
  custoAtual: number;
  delta: number;
  referencia: number;
  amostras: number;
  sufixo: 'kg' | 'un' | string;
}): string {
  const n = params.amostras;
  const notasLabel = n === 1 ? '1 nota recente' : `últimas ${n} notas`;
  return `Confira o preço: R$ ${fmtMoney(params.custoAtual)}/${params.sufixo} nesta nota vs R$ ${fmtMoney(params.referencia)}/${params.sufixo} nas ${notasLabel} (↑ R$ ${fmtMoney(params.delta)})`;
}

export function avaliarAlertaPrecoRevisao(params: {
  custoAtual: number | null | undefined;
  historico: HistoricoCustoEntry[] | number[] | null | undefined;
  descricaoAtual?: string;
  sufixo?: 'kg' | 'un' | string;
}): AlertaPrecoRevisao | null {
  if (params.custoAtual == null || !Number.isFinite(params.custoAtual) || params.custoAtual <= 0) {
    return null;
  }

  let hist: number[];
  const raw = params.historico ?? [];
  if (raw.length === 0) return null;

  if (typeof raw[0] === 'number') {
    hist = (raw as number[]).filter((v) => Number.isFinite(v) && v > 0);
  } else {
    hist = filtrarHistoricoCompativel(
      params.descricaoAtual || '',
      raw as HistoricoCustoEntry[],
    );
  }

  const check = deveAlertarPreco({
    custoAtual: params.custoAtual,
    historico: hist,
  });
  if (!check.ativo || check.referencia == null) return null;

  const sufixo = params.sufixo || 'kg';
  const amostras = Math.min(hist.length, ALERTA_PRECO_HISTORICO_NOTAS);
  return {
    ativo: true,
    custoAtual: params.custoAtual,
    referencia: check.referencia,
    delta: check.delta,
    amostras,
    mensagem: textoAlertaPrecoRevisao({
      custoAtual: params.custoAtual,
      delta: check.delta,
      referencia: check.referencia,
      amostras,
      sufixo,
    }),
  };
}

/**
 * Agrupa custos unitários das últimas N notas distintas por insumo.
 * `rows` devem vir ordenados por data da nota (mais recente primeiro).
 */
export function agruparHistoricoCustoPorInsumo(
  rows: Array<{
    estoqueInsumoId: string | null;
    custoUnitario: number | null;
    notaId: string;
    descricao?: string | null;
  }>,
  limite = ALERTA_PRECO_HISTORICO_NOTAS,
): Record<string, HistoricoCustoEntry[]> {
  const out: Record<string, HistoricoCustoEntry[]> = {};
  const seenNota = new Map<string, Set<string>>();

  for (const row of rows) {
    if (!row.estoqueInsumoId || row.custoUnitario == null || row.custoUnitario <= 0) {
      continue;
    }
    const list = out[row.estoqueInsumoId] ?? [];
    if (list.length >= limite * 3) continue; // folga p/ filtro por descrição depois

    const seen = seenNota.get(row.estoqueInsumoId) ?? new Set<string>();
    if (seen.has(row.notaId)) continue;
    seen.add(row.notaId);
    seenNota.set(row.estoqueInsumoId, seen);

    list.push({
      custo: row.custoUnitario,
      descricao: row.descricao || '',
      notaId: row.notaId,
    });
    out[row.estoqueInsumoId] = list;
  }

  return out;
}
