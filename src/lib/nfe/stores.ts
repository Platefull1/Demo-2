/**
 * Lojas Saipos usadas no CMV Real / NF-e.
 * Mesmos slugs de CmvStoreData.
 */
export const SAIPOS_STORE_BY_ID: Record<number, string> = {
  1969: 'ahu',
  1896: 'pilarzinho',
  1759: 'portao',
  8475: 'uberaba',
};

export const SAIPOS_STORE_BY_SLUG: Record<string, number> = {
  ahu: 1969,
  pilarzinho: 1896,
  portao: 1759,
  uberaba: 8475,
};

export function storeSlugFromSaiposId(storeId: number): string | null {
  return SAIPOS_STORE_BY_ID[storeId] ?? null;
}

/**
 * EstoqueProdutoConfig.produtoId refere-se ao slug `EstoqueInsumo.insumoId`
 * (não ao cuid `EstoqueInsumo.id`). Confirmado em app/api/estoque/config e
 * app/api/estoque/insumos/[id] (where produtoId: existing.insumoId).
 */
export const ESTOQUE_PRODUTO_CONFIG_ID_DOC =
  'EstoqueProdutoConfig.produtoId = EstoqueInsumo.insumoId (slug)';
