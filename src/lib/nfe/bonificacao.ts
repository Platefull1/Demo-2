/**
 * Bonificação (CFOP 5.910/6.910) e marca manual.
 * CFOP de entrada (1.xxx/2.xxx) é devolução/troca do fornecedor: compra negativa.
 * Troca sem esse CFOP só por marca manual.
 */

export const MARCA_BONIFICACAO = 'BONIFICACAO_MANUAL';
export const MARCA_TROCA = 'TROCA_MANUAL';
export const ETIQUETA_DEVOLUCAO = 'Devolução/Troca';

export type NaturezaItem = 'BONIFICACAO' | 'TROCA' | 'DEVOLUCAO';

export function cfopDigitos(cfop: string | null | undefined): string {
  return String(cfop || '').replace(/\D/g, '');
}

/** CFOP de entrada na nota do fornecedor: ele está recebendo a mercadoria de volta. */
export function cfopDevolucao(cfop: string | null | undefined): boolean {
  const d = cfopDigitos(cfop);
  return d.length === 4 && (d.startsWith('1') || d.startsWith('2'));
}

export function naturezaPorCfop(cfop: string | null | undefined): NaturezaItem | null {
  if (cfopDevolucao(cfop)) return 'DEVOLUCAO';
  const d = cfopDigitos(cfop);
  if (d === '5910' || d === '6910') return 'BONIFICACAO';
  return null;
}

export function naturezaDoItem(params: {
  cfop?: string | null;
  alertas?: unknown;
}): NaturezaItem | null {
  if (cfopDevolucao(params.cfop)) return 'DEVOLUCAO';
  const alertas = Array.isArray(params.alertas) ? params.alertas.map(String) : [];
  if (alertas.includes(MARCA_TROCA)) return 'TROCA';
  if (alertas.includes(MARCA_BONIFICACAO)) return 'BONIFICACAO';
  return naturezaPorCfop(params.cfop);
}

export function etiquetaNatureza(natureza: NaturezaItem | null): string | null {
  if (natureza === 'BONIFICACAO') return 'Bonificação';
  if (natureza === 'TROCA') return 'Troca';
  if (natureza === 'DEVOLUCAO') return ETIQUETA_DEVOLUCAO;
  return null;
}

/**
 * Compra no fechamento. Devolução entra negativa, mesmo se o lançamento
 * antigo ainda estiver gravado com o valor da nota em positivo.
 */
export function valoresLancamentoCompra(params: {
  quantidade: number;
  valor: number;
  cfop?: string | null;
  alertas?: unknown;
  transferencia?: boolean;
}): { quantidade: number; valor: number; observacao: string | null } {
  if (params.transferencia) {
    return {
      quantidade: params.quantidade,
      valor: params.valor,
      observacao: null,
    };
  }
  const natureza = naturezaDoItem({ cfop: params.cfop, alertas: params.alertas });
  const assinada = quantidadeEValorDeCompra({
    quantidade: params.quantidade,
    valor: params.valor,
    cfop: params.cfop,
  });
  return {
    quantidade: assinada.quantidade,
    valor: assinada.valor,
    observacao: etiquetaNatureza(natureza),
  };
}

export function quantidadeEValorDeCompra(params: {
  quantidade: number;
  valor: number;
  cfop?: string | null;
}): { quantidade: number; valor: number } {
  if (!cfopDevolucao(params.cfop)) {
    return { quantidade: params.quantidade, valor: params.valor };
  }
  return {
    quantidade: -Math.abs(params.quantidade),
    valor: -Math.abs(params.valor),
  };
}

/** Compra que não define o custo do saldo. Bonificação soma; devolução subtrai. */
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
