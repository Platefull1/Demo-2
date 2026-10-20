/**
 * Critério único de "item pronto" — usado pela lista, detalhe e pipeline.
 *
 * Pronto = IGNORADO, ou MAPEADO com produto + fator + quantidade convertida válidos.
 */

export type ItemProntoInput = {
  status: string;
  estoqueInsumoId?: string | null;
  fatorConversao?: number | string | null;
  quantidadeConvertida?: number | string | null;
};

function numPositivo(v: unknown): boolean {
  if (v === null || v === undefined || v === '') return false;
  const n = typeof v === 'number' ? v : Number(String(v).replace(',', '.'));
  return Number.isFinite(n) && n > 0;
}

export function itemEstaPronto(item: ItemProntoInput): boolean {
  if (item.status === 'IGNORADO') return true;
  if (item.status !== 'MAPEADO') return false;
  return (
    Boolean(item.estoqueInsumoId) &&
    numPositivo(item.fatorConversao) &&
    numPositivo(item.quantidadeConvertida)
  );
}

export function motivoItemNaoPronto(item: ItemProntoInput): string | null {
  if (itemEstaPronto(item)) return null;
  if (item.status === 'SUGERIDO') return 'SUGERIDO sem confirmação';
  if (item.status === 'SEM_MAPEAMENTO') return 'sem produto';
  if (item.status === 'MAPEADO') {
    if (!item.estoqueInsumoId) return 'MAPEADO sem produto';
    if (!numPositivo(item.fatorConversao)) return 'fator pendente/inválido';
    if (!numPositivo(item.quantidadeConvertida)) return 'conversão inválida';
  }
  return `status ${item.status}`;
}
