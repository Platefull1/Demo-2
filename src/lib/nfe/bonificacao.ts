/** Bonificação (CFOP 5.910/6.910) e marca manual. Troca só por marca manual. */

export const MARCA_BONIFICACAO = 'BONIFICACAO_MANUAL';
export const MARCA_TROCA = 'TROCA_MANUAL';

export type NaturezaItem = 'BONIFICACAO' | 'TROCA';

export function cfopDigitos(cfop: string | null | undefined): string {
  return String(cfop || '').replace(/\D/g, '');
}

export function naturezaPorCfop(cfop: string | null | undefined): NaturezaItem | null {
  const d = cfopDigitos(cfop);
  if (d === '5910' || d === '6910') return 'BONIFICACAO';
  return null;
}

export function naturezaDoItem(params: {
  cfop?: string | null;
  alertas?: unknown;
}): NaturezaItem | null {
  const alertas = Array.isArray(params.alertas) ? params.alertas.map(String) : [];
  if (alertas.includes(MARCA_TROCA)) return 'TROCA';
  if (alertas.includes(MARCA_BONIFICACAO)) return 'BONIFICACAO';
  return naturezaPorCfop(params.cfop);
}

export function etiquetaNatureza(natureza: NaturezaItem | null): string | null {
  if (natureza === 'BONIFICACAO') return 'Bonificação';
  if (natureza === 'TROCA') return 'Troca';
  return null;
}

/** Compra que não entra no custo do saldo. A quantidade e o valor do lançamento permanecem. */
export function ignorarNoCustoDoSaldo(params: {
  cfop?: string | null;
  alertas?: unknown;
}): boolean {
  return naturezaDoItem(params) != null;
}

export function preservarMarcasManuais(alertas: unknown): string[] {
  if (!Array.isArray(alertas)) return [];
  return alertas
    .map(String)
    .filter((a) => a === MARCA_BONIFICACAO || a === MARCA_TROCA);
}

export function alertasComMarca(alertas: unknown, marca: NaturezaItem | null): string[] {
  const base = (Array.isArray(alertas) ? alertas.map(String) : []).filter(
    (a) => a !== MARCA_BONIFICACAO && a !== MARCA_TROCA,
  );
  if (marca === 'BONIFICACAO') base.push(MARCA_BONIFICACAO);
  if (marca === 'TROCA') base.push(MARCA_TROCA);
  return base;
}
