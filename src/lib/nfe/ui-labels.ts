/** Labels e helpers de UI do CMV Real (revisão de notas). */

/** Faixa absurda de custo/kg (espelha fator-sugerido). */
export const CUSTO_KG_MIN = 0.5;
export const CUSTO_KG_MAX = 500;

export const CMV_STORE_LABELS: Record<string, string> = {
  ahu: 'Ahú',
  pilarzinho: 'Pilarzinho',
  portao: 'Portão',
  uberaba: 'Uberaba',
};

export function storeLabel(slug: string | null | undefined): string {
  if (!slug) return '—';
  return CMV_STORE_LABELS[slug] ?? slug;
}

export const NOTA_STATUS_LABELS: Record<string, string> = {
  EM_REVISAO: 'Para revisar',
  APROVADA: 'Aprovada',
  IGNORADA: 'Fora do CMV',
};

export function notaStatusLabel(status: string): string {
  return NOTA_STATUS_LABELS[status] ?? status;
}

/** Abreviações da nota → nome legível. */
export const UNIDADE_NOTA_NOMES: Record<string, string> = {
  BIS: 'bisnaga',
  FD: 'fardo',
  CX: 'caixa',
  PCT: 'pacote',
  LAT: 'lata',
  G: 'fardo/pack',
  TON: 'unidade do fornecedor',
  UN: 'unidade',
  KG: 'quilo',
};

export function unidadeNotaNome(und: string | null | undefined): string {
  const u = (und || 'UN').toUpperCase().trim();
  return UNIDADE_NOTA_NOMES[u] ?? u.toLowerCase();
}

/** Pergunta do campo de conversão + sufixo do input. */
export function perguntaFator(
  unidadeNota: string,
  unidadeCmv: 'KG' | 'UN' | string,
): { pergunta: string; sufixo: 'kg' | 'un' } {
  const und = (unidadeNota || 'UN').toUpperCase().trim() || 'UN';
  if (unidadeCmv === 'UN') {
    return {
      pergunta: `Quantas unidades vêm em 1 ${und}?`,
      sufixo: 'un',
    };
  }
  return {
    pergunta: `Quanto pesa 1 ${und}?`,
    sufixo: 'kg',
  };
}

export function textoAlertaAmbiguo(unidadeNota: string): string {
  const und = (unidadeNota || 'UN').toUpperCase().trim() || 'UN';
  const nome = unidadeNotaNome(und);
  return `Confira o peso: a nota veio em ${und} (${nome})`;
}

export function formatNumBr(n: number, decimals = 2): string {
  return n.toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
