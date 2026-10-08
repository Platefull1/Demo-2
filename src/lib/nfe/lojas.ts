/**
 * Slugs e nomes de loja do CMV Real + normalização de lojaNome (contagem).
 */

import { CMV_STORE_LABELS, storeLabel } from './ui-labels';

export const CMV_STORE_SLUGS = ['ahu', 'pilarzinho', 'portao', 'uberaba'] as const;
export type CmvStoreSlug = (typeof CMV_STORE_SLUGS)[number];

export { CMV_STORE_LABELS, storeLabel };

/** Aliases normalizados → storeSlug */
const LOJA_NOME_ALIASES: Record<string, CmvStoreSlug> = {
  ahu: 'ahu',
  ahuu: 'ahu',
  ahú: 'ahu',
  'calenzano ahu': 'ahu',
  'calenzano ahú': 'ahu',
  pilarzinho: 'pilarzinho',
  'calenzano pilarzinho': 'pilarzinho',
  portao: 'portao',
  portão: 'portao',
  'calenzano portao': 'portao',
  'calenzano portão': 'portao',
  uberaba: 'uberaba',
  'calenzano uberaba': 'uberaba',
};

/** Remove acentos e baixa. */
export function normalizarLojaNome(raw: string): string {
  return String(raw || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Mapeia lojaNome livre (EstoqueContagem) → storeSlug.
 * Retorna null se não identificar.
 */
export function storeSlugFromLojaNome(lojaNome: string | null | undefined): CmvStoreSlug | null {
  if (!lojaNome) return null;
  const n = normalizarLojaNome(lojaNome);
  if (!n) return null;
  if (LOJA_NOME_ALIASES[n]) return LOJA_NOME_ALIASES[n];
  // Contém o slug
  for (const slug of CMV_STORE_SLUGS) {
    const slugNorm = normalizarLojaNome(slug === 'portao' ? 'portao' : slug);
    if (n === slugNorm || n.includes(slugNorm)) return slug;
  }
  if (n.includes('ahu')) return 'ahu';
  if (n.includes('pilar')) return 'pilarzinho';
  if (n.includes('porta')) return 'portao';
  if (n.includes('uber')) return 'uberaba';
  return null;
}

/**
 * CNPJ (só dígitos) → storeSlug, quando a nota de transferência
 * identifica a loja emissora. Preencher conforme CNPJs reais das lojas.
 */
export const STORE_CNPJ_BY_SLUG: Partial<Record<CmvStoreSlug, string>> = {
  // preencher quando conhecidos
};

export function storeSlugFromCnpj(cnpj: string | null | undefined): CmvStoreSlug | null {
  const digits = String(cnpj || '').replace(/\D/g, '');
  if (digits.length < 11) return null;
  for (const [slug, c] of Object.entries(STORE_CNPJ_BY_SLUG)) {
    if (c && c.replace(/\D/g, '') === digits) return slug as CmvStoreSlug;
  }
  return null;
}

/** Competência anterior YYYY-MM. */
export function competenciaAnterior(competencia: string): string {
  const [y, m] = competencia.split('-').map(Number);
  if (!y || !m) throw new Error(`competência inválida: ${competencia}`);
  if (m === 1) return `${y - 1}-12`;
  return `${y}-${String(m - 1).padStart(2, '0')}`;
}
