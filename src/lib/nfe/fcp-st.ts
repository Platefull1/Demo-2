/**
 * Rateio de impostos de nível de nota que a Saipos não inclui no net_item_value.
 * Caso validado: total_fcp_st (Coca-Cola FEMSA, Ambev/CRBS).
 */

export interface ItemParaRateio {
  /** id estável do item (saiposItemId) */
  id: string | number;
  netItemValue: number;
}

export interface ResultadoRateioItem {
  id: string | number;
  netOriginal: number;
  rateado: number;
  valorLiquido: number;
}

export interface ResultadoRateio {
  aplicado: boolean;
  campo: string | null;
  totalRateado: number;
  itens: ResultadoRateioItem[];
}

/** Campos de nível de nota conhecidos como "não rateados" pela Saipos. */
export const CAMPOS_NAO_RATEADOS_SAIPOS = ['total_fcp_st'] as const;

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * Se `naoRateado ≈ campo` (ex.: total_fcp_st), distribui proporcionalmente
 * ao net_item_value; resíduo de centavos no maior item.
 */
export function ratearImpostoNota(
  valorTotal: number,
  itens: ItemParaRateio[],
  impostosNota: Record<string, number | null | undefined>,
  campos: readonly string[] = CAMPOS_NAO_RATEADOS_SAIPOS,
  tolerancia = 0.02,
): ResultadoRateio {
  const somaNet = itens.reduce((s, it) => s + (it.netItemValue || 0), 0);
  const naoRateado = round2(valorTotal - somaNet);

  const vazio: ResultadoRateio = {
    aplicado: false,
    campo: null,
    totalRateado: 0,
    itens: itens.map((it) => ({
      id: it.id,
      netOriginal: it.netItemValue,
      rateado: 0,
      valorLiquido: round2(it.netItemValue),
    })),
  };

  if (itens.length === 0 || Math.abs(naoRateado) <= tolerancia) {
    return vazio;
  }

  let campoMatch: string | null = null;
  let valorCampo = 0;
  for (const campo of campos) {
    const v = Number(impostosNota[campo] ?? 0);
    if (v > 0 && Math.abs(naoRateado - v) <= tolerancia) {
      campoMatch = campo;
      valorCampo = v;
      break;
    }
  }

  if (!campoMatch || valorCampo <= 0 || somaNet <= 0) {
    return vazio;
  }

  // Proporcional; arredonda 2 casas; resíduo no maior item
  const rateios = itens.map((it) => ({
    id: it.id,
    netOriginal: it.netItemValue,
    rateado: round2((it.netItemValue / somaNet) * valorCampo),
  }));

  const somaRateio = round2(rateios.reduce((s, r) => s + r.rateado, 0));
  const residuo = round2(valorCampo - somaRateio);
  if (residuo !== 0 && rateios.length > 0) {
    let maiorIdx = 0;
    for (let i = 1; i < rateios.length; i++) {
      if (rateios[i].netOriginal > rateios[maiorIdx].netOriginal) maiorIdx = i;
    }
    rateios[maiorIdx].rateado = round2(rateios[maiorIdx].rateado + residuo);
  }

  return {
    aplicado: true,
    campo: campoMatch,
    totalRateado: valorCampo,
    itens: rateios.map((r) => ({
      ...r,
      valorLiquido: round2(r.netOriginal + r.rateado),
    })),
  };
}
