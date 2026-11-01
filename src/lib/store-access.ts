/**
 * Escopo de lojas compartilhado (CMV Real + Estoque).
 *
 * Fonte de verdade da sessão/tenant: `@/lib/nfe/tenant` (`getCmvRealTenant*`,
 * `resolveCmvRealStoreFilter`, `requireCmvRealAccess`).
 * Este módulo só interpreta `CmvRealTenant` + `lojaNome` sem puxar Stack Auth.
 */

import type { CmvRealTenant } from '@/lib/nfe/tenant';
import {
  CMV_STORE_SLUGS,
  storeLabel,
  storeSlugFromLojaNome,
} from '@/lib/nfe/lojas';

export type { CmvRealTenant } from '@/lib/nfe/tenant';
export {
  CMV_STORE_SLUGS,
  type CmvStoreSlug,
  storeSlugFromLojaNome,
  storeLabel,
  CMV_STORE_LABELS,
  normalizarLojaNome,
} from '@/lib/nfe/lojas';

export type LojaSelecao = { slug: string; nome: string };

/**
 * Lojas para iniciar contagem. Não depende de /api/rh/lojas (módulo RH).
 * Nome do cadastro RH quando o slug bate; senão o rótulo canônico (Ahú…).
 */
export function lojasParaSelecao(opts: {
  allowedStoreSlugs: string[] | null;
  lojaNaoConfigurada?: boolean;
  rhLojas?: { nome: string }[];
}): LojaSelecao[] {
  if (opts.lojaNaoConfigurada) return [];

  const rhBySlug = new Map<string, string>();
  for (const l of opts.rhLojas ?? []) {
    const slug = storeSlugFromLojaNome(l.nome);
    if (slug && !rhBySlug.has(slug)) rhBySlug.set(slug, l.nome);
  }

  const slugs =
    opts.allowedStoreSlugs === null
      ? [...CMV_STORE_SLUGS]
      : opts.allowedStoreSlugs.filter(Boolean);

  return slugs.map((slug) => ({
    slug,
    nome: rhBySlug.get(slug) ?? storeLabel(slug),
  }));
}

/**
 * Lojas permitidas do tenant.
 * - null → todas (admin / escritório com lojas=[])
 * - string[] → só essas (gerente_loja)
 * - [] → nada (gerente sem loja configurada)
 */
export function getLojasDoUsuario(tenant: CmvRealTenant): string[] | null {
  if (tenant.lojaNaoConfigurada) return [];
  if (tenant.isAdmin || tenant.allowedStoreSlugs === null) return null;
  return tenant.allowedStoreSlugs;
}

/**
 * Contagem (ou outro registro com lojaNome) acessível ao tenant?
 *
 * - Admin / escopo "todas": sempre true (inclui lojaNome null).
 * - Gerente (allowedStoreSlugs preenchido): exige lojaNome cujo slug
 *   esteja na lista; lojaNome null ou não reconhecido → false.
 */
export function canAccessLojaNome(
  tenant: CmvRealTenant,
  lojaNome: string | null | undefined,
): boolean {
  const allowed = getLojasDoUsuario(tenant);
  if (allowed === null) return true;
  if (allowed.length === 0) return false;
  if (!lojaNome) return false;
  const slug = storeSlugFromLojaNome(lojaNome);
  if (!slug) return false;
  return allowed.includes(slug);
}

/** true se o usuário tem exatamente uma loja no escopo. */
export function singleStoreSlug(tenant: CmvRealTenant): string | null {
  const allowed = getLojasDoUsuario(tenant);
  if (!allowed || allowed.length !== 1) return null;
  return allowed[0];
}

/** Filtra registros com `lojaNome` pelo escopo do tenant. */
export function filterByLojaAccess<T extends { lojaNome?: string | null }>(
  rows: T[],
  tenant: CmvRealTenant,
): T[] {
  return rows.filter((r) => canAccessLojaNome(tenant, r.lojaNome));
}
