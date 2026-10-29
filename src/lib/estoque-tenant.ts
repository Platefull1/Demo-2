import { getEffectiveDbUser, getEffectiveUserIds } from '@/lib/effective-user';
import {
  getCmvRealTenantFromSession,
  type CmvRealTenant,
} from '@/lib/nfe/tenant';
import { canAccessTool } from '@/lib/auth/toolPermissions';
import { getRhContext } from '@/lib/rh-auth';
import { SystemTool } from '@/types/admin';

export {
  dedupeInsumosByNome,
  normalizarNomeInsumo,
  slugifyInsumoNome,
} from '@/lib/estoque-nome';

export interface EstoqueTenantContext {
  tenantUserId: string;
  userIds: string[];
  /** Escopo de loja (mesma regra do CMV Real). */
  store: CmvRealTenant;
}

/** Tenant + IDs históricos dos membros da equipe RH + escopo de loja. */
export async function getEstoqueTenantContext(): Promise<EstoqueTenantContext | null> {
  const ctx = await getRhContext();
  if (!ctx) return null;
  if (!(await canAccessTool(ctx.stackUserId, SystemTool.ESTOQUE))) return null;
  const dbUser = await getEffectiveDbUser();
  if (!dbUser) return null;
  const store = await getCmvRealTenantFromSession();
  if (!store) return null;
  const userIds = await getEffectiveUserIds(dbUser.id);
  return { tenantUserId: dbUser.id, userIds, store };
}

/** Deduplica por insumoId; configuração do tenant prevalece. */
export function dedupeInsumosBySlug<T extends { insumoId: string; userId: string }>(
  items: T[],
  tenantUserId: string,
): T[] {
  const bySlug = new Map<string, T>();
  for (const item of items) {
    if (item.userId !== tenantUserId) bySlug.set(item.insumoId, item);
  }
  for (const item of items) {
    if (item.userId === tenantUserId) bySlug.set(item.insumoId, item);
  }
  return Array.from(bySlug.values());
}

type ProdutoConfigRow = {
  produtoId: string;
  userId: string;
  ativo: boolean;
  estoqueMinimo: number | null;
  modoContagem: string | null;
  kgPorUnidade: number | null;
};

/** Mescla configs de vários userIds; tenant prevalece em conflito. */
export function mergeProdutoConfigs(
  rows: ProdutoConfigRow[],
  tenantUserId: string,
): Record<
  string,
  {
    ativo: boolean;
    estoqueMinimo?: number;
    modoContagem?: 'kg' | 'unidade';
    kgPorUnidade?: number;
  }
> {
  const configMap: Record<
    string,
    {
      ativo: boolean;
      estoqueMinimo?: number;
      modoContagem?: 'kg' | 'unidade';
      kgPorUnidade?: number;
    }
  > = {};

  const toEntry = (c: ProdutoConfigRow) => ({
    ativo: c.ativo,
    estoqueMinimo: c.estoqueMinimo ?? undefined,
    modoContagem: (c.modoContagem as 'kg' | 'unidade') ?? 'kg',
    kgPorUnidade: c.kgPorUnidade ?? undefined,
  });

  for (const c of rows) {
    if (c.userId !== tenantUserId) configMap[c.produtoId] = toEntry(c);
  }
  for (const c of rows) {
    if (c.userId === tenantUserId) configMap[c.produtoId] = toEntry(c);
  }

  return configMap;
}

/** Ordem de produtos: usa a do tenant; senão a mais longa do grupo. */
export function mergeProdutoOrdem(
  rows: { userId: string; ordem: unknown }[],
  tenantUserId: string,
): string[] {
  const tenantRow = rows.find((r) => r.userId === tenantUserId);
  const tenantOrder = Array.isArray(tenantRow?.ordem) ? (tenantRow!.ordem as string[]) : [];
  if (tenantOrder.length > 0) return tenantOrder;

  return rows.reduce<string[]>((best, r) => {
    const o = Array.isArray(r.ordem) ? (r.ordem as string[]) : [];
    return o.length > best.length ? o : best;
  }, []);
}
