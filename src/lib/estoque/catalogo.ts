/**
 * Catálogo de produtos do Estoque — fonte única para:
 * - aba Produtos (/estoque → GET /api/estoque/insumos)
 * - importador CMV Real
 * - pipeline NF-e (sugestão por similaridade + kgPorUnidade)
 *
 * ## Como a aba Produtos monta a lista
 *
 * Rota: `GET /api/estoque/insumos`
 * UI: `useProdutosEstoque` → `GerenciarProdutos`
 *
 * Resolução de usuário (`getEstoqueTenantContext` → `getEffectiveDbUser` → `getRhContext`):
 * 1. Sessão Stack Auth → User da sessão
 * 2. Se o User **é dono** de equipe RH (tem RhTeamMember com tenantUserId=ele) →
 *    tenant = ele mesmo
 * 3. Senão, se é **membro** ativo de outro tenant → tenant = tenantUserId do dono
 * 4. Queries: `EstoqueInsumo` onde `userId IN (tenant + membros com login)`
 * 5. `dedupeInsumosBySlug`: um registro por `insumoId` (slug); preferência do tenant
 * 6. Se a lista vier vazia: seed de `INSUMOS_PADRAO` (~157 itens) no tenant
 *
 * Não é catálogo estático na UI — a lista vem do banco (com merge multi-conta).
 * `EstoqueProdutoConfig.produtoId` = slug `EstoqueInsumo.insumoId` (não o cuid).
 *
 * ## NF-e vs Produtos (observado em 2026-09-29)
 *
 * - ServiceApiKey `calenzano.ahu` → userId `cmjhty6hu0001jy04sstknpdo`
 * - NF-e ingeridas ficam com esse userId (42 notas)
 * - A mesma conta, na sessão web, **não** é dona do time: é membro do tenant
 *   `platefull.app@gmail.com` (`cmk5ykusf0001jz04iwmf8xa8`)
 * - Produtos na sessão: merge do tenant → **179** slugs únicos
 * - Contagens por conta isolada: 156–165 (por isso “nenhum userId tem 179”)
 *
 * Conclusão: o dono das NF-e (API key / loja) ≠ dono do catálogo Estoque (tenant RH).
 * Este módulo resolve o catálogo pelo **mesmo algoritmo do Estoque** a partir de
 * qualquer userId (sessão ou API key), sem mudar o userId gravado nas NF-e.
 */

import { prisma } from '@/lib/prisma';
import {
  dedupeInsumosBySlug,
  getEstoqueTenantContext,
  mergeProdutoConfigs,
} from '@/lib/estoque-tenant';
import { normalizarDescricao } from '@/lib/nfe/normalize';
import { volumesConflitam } from '@/lib/nfe/volume';

export interface EstoqueCatalogoItem {
  /** cuid EstoqueInsumo (preferência do tenant após dedupe) */
  id: string;
  /** slug */
  insumoId: string;
  nome: string;
  nomeNormalizado: string;
  unidade: string;
  categoriaId: string;
  categoriaNome: string;
  userId: string;
  ativo: boolean;
  kgPorUnidade: number | null;
  modoContagem: 'kg' | 'unidade';
}

export interface EstoqueCatalogoResolvido {
  /** User.id do tenant RH (dono dos dados compartilhados) */
  tenantUserId: string;
  /** IDs usados na query (tenant + membros) */
  userIds: string[];
  itens: EstoqueCatalogoItem[];
}

/**
 * Resolve tenant RH a partir de um User.id (sem sessão Stack).
 * Espelha a ordem de getRhContext:
 * dono de equipe → próprio id; senão membro → tenantUserId; senão próprio id.
 */
export async function resolveEstoqueTenantForUserId(
  userId: string,
): Promise<{ tenantUserId: string; userIds: string[] } | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, stackUserId: true },
  });
  if (!user) return null;

  const ownsTeam =
    (await prisma.rhTeamMember.count({
      where: { tenantUserId: user.id, isActive: true },
    })) > 0;

  let tenantUserId = user.id;

  if (!ownsTeam && user.stackUserId) {
    const membership = await prisma.rhTeamMember.findFirst({
      where: { stackUserId: user.stackUserId, isActive: true },
      select: { tenantUserId: true },
    });
    if (membership) tenantUserId = membership.tenantUserId;
  }

  const members = await prisma.rhTeamMember.findMany({
    where: { tenantUserId, isActive: true, stackUserId: { not: null } },
    select: { stackUserId: true },
  });

  const memberUsers =
    members.length === 0
      ? []
      : await prisma.user.findMany({
          where: {
            stackUserId: {
              in: members.map((m) => m.stackUserId!).filter(Boolean),
            },
          },
          select: { id: true },
        });

  const userIds = [tenantUserId, ...memberUsers.map((u) => u.id)];
  return { tenantUserId, userIds: [...new Set(userIds)] };
}

/**
 * Catálogo deduplicado + config (kgPorUnidade), mesma fonte da aba Produtos.
 */
export async function loadCatalogoEstoqueForUserId(
  userId: string,
): Promise<EstoqueCatalogoResolvido | null> {
  const resolved = await resolveEstoqueTenantForUserId(userId);
  if (!resolved) return null;
  return loadCatalogoEstoqueForTenant(resolved.tenantUserId, resolved.userIds);
}

/** Atalho para rotas web autenticadas (mesma sessão da aba Produtos). */
export async function loadCatalogoEstoqueFromSession(): Promise<EstoqueCatalogoResolvido | null> {
  const ctx = await getEstoqueTenantContext();
  if (!ctx) return null;
  return loadCatalogoEstoqueForTenant(ctx.tenantUserId, ctx.userIds);
}

async function loadCatalogoEstoqueForTenant(
  tenantUserId: string,
  userIds: string[],
): Promise<EstoqueCatalogoResolvido> {
  const [insumos, configs] = await Promise.all([
    prisma.estoqueInsumo.findMany({
      where: { userId: { in: userIds } },
      orderBy: [{ categoriaId: 'asc' }, { createdAt: 'asc' }],
    }),
    prisma.estoqueProdutoConfig.findMany({
      where: { userId: { in: userIds } },
    }),
  ]);

  const deduped = dedupeInsumosBySlug(insumos, tenantUserId);
  const configMap = mergeProdutoConfigs(configs, tenantUserId);

  const itens: EstoqueCatalogoItem[] = deduped.map((p) => {
    const cfg = configMap[p.insumoId];
    return {
      id: p.id,
      insumoId: p.insumoId,
      nome: p.nome,
      nomeNormalizado: normalizarDescricao(p.nome),
      unidade: p.unidade,
      categoriaId: p.categoriaId,
      categoriaNome: p.categoriaNome,
      userId: p.userId,
      ativo: cfg?.ativo !== false,
      kgPorUnidade: cfg?.kgPorUnidade ?? null,
      modoContagem: cfg?.modoContagem ?? (p.unidade === 'un' ? 'unidade' : 'kg'),
    };
  });

  return { tenantUserId, userIds, itens };
}

/** Score 0–1 entre dois nomes (já pode vir bruto; normaliza internamente). */
export function scoreNomeProduto(a: string, b: string): number {
  const na = normalizarDescricao(a);
  const nb = normalizarDescricao(b);
  if (!na || !nb) return 0;
  if (na === nb) return 1;
  if (na.includes(nb) || nb.includes(na)) {
    return Math.min(na.length, nb.length) / Math.max(na.length, nb.length);
  }
  const ta = new Set(na.split(' ').filter((t) => t.length > 2));
  const tb = new Set(nb.split(' ').filter((t) => t.length > 2));
  if (ta.size === 0 || tb.size === 0) return 0;
  let inter = 0;
  for (const t of ta) if (tb.has(t)) inter++;
  return inter / Math.max(ta.size, tb.size);
}

export function matchCatalogoPorNome(
  nomePlanilha: string,
  catalogo: EstoqueCatalogoItem[],
  opts?: { minCasado?: number; minSugerido?: number; soAtivos?: boolean },
): {
  status: 'casado' | 'sugerido' | 'nao_encontrado';
  item?: EstoqueCatalogoItem;
  score: number;
} {
  const minCasado = opts?.minCasado ?? 0.95;
  const minSugerido = opts?.minSugerido ?? 0.55;
  const lista = opts?.soAtivos === false ? catalogo : catalogo.filter((c) => c.ativo);

  let best: { item: EstoqueCatalogoItem; score: number } | null = null;
  const alvo = normalizarDescricao(nomePlanilha);

  for (const c of lista) {
    if (volumesConflitam(nomePlanilha, c.nome)) continue;
    // match exato normalizado primeiro
    let score =
      c.nomeNormalizado === alvo ? 1 : scoreNomeProduto(nomePlanilha, c.nome);
    if (score < minSugerido) continue;
    if (!best || score > best.score) best = { item: c, score };
  }

  if (!best) return { status: 'nao_encontrado', score: 0 };
  if (best.score >= minCasado) {
    return { status: 'casado', item: best.item, score: best.score };
  }
  return { status: 'sugerido', item: best.item, score: best.score };
}
