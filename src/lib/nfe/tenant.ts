/**
 * Tenancy do CMV Real / NF-e.
 *
 * Decisão (2026-09-29): TODOS os dados do módulo pertencem ao DONO do grupo RH
 * (`tenantUserId`), não à conta individual da loja.
 *
 * Hoje: dono = platefull.app (`cmk5ykusf0001jz04iwmf8xa8`);
 * ahu / pilarzinho / estoquecalenzano = membros.
 *
 * - Sessão web: resolve via getRhContext (igual Estoque).
 * - ServiceApiKey (ex.: calenzano.ahu): resolve o tenant do dono a partir do
 *   userId da key — a key NÃO muda; só o destino da gravação.
 *
 * WhatsApp: sessões WPPConnect ficam na conta ahu. `findWhatsAppBotForTenant`
 * já inclui stackUserIds dos membros; preferimos o actor (API key / sessão)
 * quando ele tiver o slot, para não pegar outra conta do mesmo slot.
 *
 * Visibilidade por loja: RhTeamMember NÃO tem vínculo lojaId. Default suave
 * por e-mail (calenzano.ahu → ahu); senão filtro livre.
 *
 * Fase 4 (anotar): estoque final por loja deve ler EstoqueContagem de
 * QUALQUER conta do grupo (userIds), filtrando por lojaNome — não só do dono.
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRhContext } from '@/lib/rh-auth';
import { findWhatsAppBotForTenant } from '@/lib/whatsapp-sessions';
import { SAIPOS_STORE_BY_SLUG } from '@/lib/nfe/stores';

export interface CmvRealTenant {
  /** Dono do grupo — userId de todas as tabelas CMV Real / NF-e */
  tenantUserId: string;
  /** Conta que autenticou (sessão ou ServiceApiKey) */
  actorUserId: string;
  /** true = dono do time */
  isAdmin: boolean;
  /** Membros (+ dono) para leituras cruzadas (ex.: contagens Fase 4) */
  userIds: string[];
  /**
   * Sugestão de loja para o ator (gerente). null = ver todas / escolher.
   * Heurística por e-mail; sem vínculo formal membro→loja no RH.
   */
  defaultStoreSlug: string | null;
  /** Aviso quando não há vínculo formal de loja */
  lojaVinculo: 'email_heuristica' | 'admin_todas' | 'nenhum';
}

const EMAIL_STORE_HINTS: Array<{ re: RegExp; slug: string }> = [
  { re: /\.ahu@/i, slug: 'ahu' },
  { re: /ahu@/i, slug: 'ahu' },
  { re: /pilarzinho/i, slug: 'pilarzinho' },
  { re: /portao|portão/i, slug: 'portao' },
  { re: /uberaba/i, slug: 'uberaba' },
];

export function inferStoreSlugFromEmail(email: string | null | undefined): string | null {
  if (!email) return null;
  for (const h of EMAIL_STORE_HINTS) {
    if (h.re.test(email) && SAIPOS_STORE_BY_SLUG[h.slug]) return h.slug;
  }
  return null;
}

async function memberUserIds(tenantUserId: string): Promise<string[]> {
  const members = await prisma.rhTeamMember.findMany({
    where: { tenantUserId, isActive: true, stackUserId: { not: null } },
    select: { stackUserId: true },
  });
  if (members.length === 0) return [tenantUserId];
  const users = await prisma.user.findMany({
    where: {
      stackUserId: { in: members.map((m) => m.stackUserId!).filter(Boolean) },
    },
    select: { id: true },
  });
  return [...new Set([tenantUserId, ...users.map((u) => u.id)])];
}

/**
 * Resolve tenant CMV Real a partir de um users.id (API key ou User já conhecido).
 */
export async function getCmvRealTenantFromUserId(
  actorUserId: string,
): Promise<CmvRealTenant | null> {
  const user = await prisma.user.findUnique({
    where: { id: actorUserId },
    select: { id: true, stackUserId: true, email: true },
  });
  if (!user) return null;

  const ownsTeam =
    (await prisma.rhTeamMember.count({
      where: { tenantUserId: user.id, isActive: true },
    })) > 0;

  let tenantUserId = user.id;
  let isAdmin = ownsTeam;

  if (!ownsTeam && user.stackUserId) {
    const membership = await prisma.rhTeamMember.findFirst({
      where: { stackUserId: user.stackUserId, isActive: true },
      select: { tenantUserId: true },
    });
    if (membership) {
      tenantUserId = membership.tenantUserId;
      isAdmin = false;
    } else {
      isAdmin = true; // conta solo
    }
  }

  const userIds = await memberUserIds(tenantUserId);
  const defaultStoreSlug = isAdmin ? null : inferStoreSlugFromEmail(user.email);

  return {
    tenantUserId,
    actorUserId: user.id,
    isAdmin,
    userIds,
    defaultStoreSlug,
    lojaVinculo: isAdmin
      ? 'admin_todas'
      : defaultStoreSlug
        ? 'email_heuristica'
        : 'nenhum',
  };
}

/** Alias pedido: sessão web → tenant dono do grupo. */
export async function getCmvRealTenant(): Promise<CmvRealTenant | null> {
  return getCmvRealTenantFromSession();
}

/** Sessão web — mesmo critério do Estoque/RH. */
export async function getCmvRealTenantFromSession(): Promise<CmvRealTenant | null> {
  const ctx = await getRhContext();
  if (!ctx) return null;

  const actor = await prisma.user.findFirst({
    where: { stackUserId: ctx.stackUserId },
    select: { id: true, email: true },
  });
  if (!actor) {
    // fallback: tenant como actor
    return getCmvRealTenantFromUserId(ctx.userId);
  }

  const userIds = await memberUserIds(ctx.userId);
  const defaultStoreSlug = ctx.isAdmin ? null : inferStoreSlugFromEmail(actor.email);

  return {
    tenantUserId: ctx.userId,
    actorUserId: actor.id,
    isAdmin: ctx.isAdmin,
    userIds,
    defaultStoreSlug,
    lojaVinculo: ctx.isAdmin
      ? 'admin_todas'
      : defaultStoreSlug
        ? 'email_heuristica'
        : 'nenhum',
  };
}

export async function requireCmvRealTenantFromSession(): Promise<
  CmvRealTenant | NextResponse
> {
  const t = await getCmvRealTenantFromSession();
  if (!t) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  return t;
}

/**
 * Filtro de loja para listagens CMV Real.
 * - Dono (isAdmin): null → sem filtro (todas as lojas).
 * - Membro com defaultStoreSlug: filtra por esse slug (pode sobrescrever com override).
 * - Membro sem vínculo: null → filtro livre (UI deve avisar lojaVinculo=nenhum).
 */
export function resolveCmvRealStoreFilter(
  tenant: CmvRealTenant,
  overrideSlug?: string | null,
): string | null {
  if (overrideSlug) return overrideSlug;
  if (tenant.isAdmin) return null;
  return tenant.defaultStoreSlug;
}

/**
 * Bot WhatsApp: prefere a conta do actor (API key ahu / sessão que tem WPP),
 * senão qualquer bot do tenant (membros incluídos).
 */
export async function findCmvRealWhatsAppBot(
  tenant: CmvRealTenant,
  sessionSlot: number,
) {
  const actor = await prisma.user.findUnique({
    where: { id: tenant.actorUserId },
    select: { stackUserId: true },
  });
  if (actor?.stackUserId) {
    const bot = await prisma.whatsAppBot.findFirst({
      where: { userId: actor.stackUserId, slot: sessionSlot },
      select: { userId: true, slot: true, isConnected: true, label: true },
    });
    if (bot) return bot;
  }
  return findWhatsAppBotForTenant(tenant.tenantUserId, sessionSlot);
}
