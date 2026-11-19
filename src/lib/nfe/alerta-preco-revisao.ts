/**
 * Alerta de aumento de preço na revisão de NF-e.
 * Compara o custo unitário atual (R$/kg ou R$/un) com as últimas notas do mesmo item.
 */

export const ALERTA_PRECO_DELTA_REAIS = 3;
export const ALERTA_PRECO_HISTORICO_NOTAS = 5;

export type AlertaPrecoRevisao = {
  ativo: boolean;
  custoAtual: number;
  referencia: number;
  delta: number;
  amostras: number;
  /** Texto no mesmo tom do "Confira o peso". */
  mensagem: string;
};

/** Mediana de uma lista (cópia ordenada). */
export function mediana(valores: number[]): number | null {
  const xs = valores.filter((v) => Number.isFinite(v) && v > 0).sort((a, b) => a - b);
  if (xs.length === 0) return null;
  const mid = Math.floor(xs.length / 2);
  if (xs.length % 2 === 1) return xs[mid]!;
  return (xs[mid - 1]! + xs[mid]!) / 2;
}

/**
 * Dispara alerta quando o custo atual está ≥ R$ 3 acima da mediana das últimas notas.
 * Usa delta absoluto (não %), para também pegar aumento relevante em itens baratos.
 */
export function deveAlertarPreco(params: {
  custoAtual: number;
  historico: number[];
  deltaMinimo?: number;
}): { ativo: boolean; referencia: number | null; delta: number } {
  const deltaMin = params.deltaMinimo ?? ALERTA_PRECO_DELTA_REAIS;
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

export function textoAlertaPrecoRevisao(params: {
  delta: number;
  referencia: number;
  amostras: number;
  sufixo: 'kg' | 'un' | string;
}): string {
  const deltaFmt = params.delta.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const refFmt = params.referencia.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const n = params.amostras;
  const notasLabel = n === 1 ? '1 nota recente' : `últimas ${n} notas`;
  return `Confira o preço: está R$ ${deltaFmt}/${params.sufixo} acima da ${notasLabel} (ref. R$ ${refFmt}/${params.sufixo})`;
}

export function avaliarAlertaPrecoRevisao(params: {
  custoAtual: number | null | undefined;
  historico: number[] | null | undefined;
  sufixo?: 'kg' | 'un' | string;
}): AlertaPrecoRevisao | null {
  const hist = (params.historico ?? []).filter((v) => Number.isFinite(v) && v > 0);
  if (params.custoAtual == null || !Number.isFinite(params.custoAtual) || params.custoAtual <= 0) {
    return null;
  }
  if (hist.length === 0) return null;

  const check = deveAlertarPreco({
    custoAtual: params.custoAtual,
    historico: hist,
  });
  if (!check.ativo || check.referencia == null) return null;

  const sufixo = params.sufixo || 'kg';
  return {
    ativo: true,
    custoAtual: params.custoAtual,
    referencia: check.referencia,
    delta: check.delta,
    amostras: Math.min(hist.length, ALERTA_PRECO_HISTORICO_NOTAS),
    mensagem: textoAlertaPrecoRevisao({
      delta: check.delta,
      referencia: check.referencia,
      amostras: Math.min(hist.length, ALERTA_PRECO_HISTORICO_NOTAS),
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
  }>,
  limite = ALERTA_PRECO_HISTORICO_NOTAS,
): Record<string, number[]> {
  const out: Record<string, number[]> = {};
  const seenNota = new Map<string, Set<string>>();

  for (const row of rows) {
    if (!row.estoqueInsumoId || row.custoUnitario == null || row.custoUnitario <= 0) {
      continue;
    }
    const list = out[row.estoqueInsumoId] ?? [];
    if (list.length >= limite) continue;

    const seen = seenNota.get(row.estoqueInsumoId) ?? new Set<string>();
    if (seen.has(row.notaId)) continue;
    seen.add(row.notaId);
    seenNota.set(row.estoqueInsumoId, seen);

    list.push(row.custoUnitario);
    out[row.estoqueInsumoId] = list;
  }

  return out;
}
