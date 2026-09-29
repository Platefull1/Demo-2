/**
 * Tenancy + acesso do CMV Real / NF-e.
 *
 * Dados: sempre no DONO do grupo (`tenantUserId`).
 * Acesso: permissões RH `cmv_real.*` + campo `lojas` do RhTeamMember.
 * Dono (isAdmin): todas as permissões e todas as lojas.
 * lojas=[] = todas — exceto perfil gerente_loja, que exige ao menos uma loja.
 *
 * WhatsApp: sessões na conta ahu; `findCmvRealWhatsAppBot` prefere o actor.
 *
 * Fase 4: EstoqueContagem de QUALQUER conta ativa do grupo, por lojaNome.
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRhContext, type RhContext } from '@/lib/rh-auth';
import { findWhatsAppBotForTenant } from '@/lib/whatsapp-sessions';
import { type RhMemberPerfil, type RhPermissionKey } from '@/lib/rh-permissions';

export interface CmvRealTenant {
  tenantUserId: string;
  actorUserId: string;
  isAdmin: boolean;
  userIds: string[];
  /** null = todas as lojas; string[] = só essas */
  allowedStoreSlugs: string[] | null;
  /** true = gerente sem loja configurada → bloquear módulo */
  lojaNaoConfigurada: boolean;
  perfil: RhMemberPerfil | null;
  memberId: string | null;
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

function parsePerfil(raw: string | null | undefined): RhMemberPerfil | null {
  if (raw === 'escritorio' || raw === 'gerente_loja') return raw;
  return null;
}

function storeScope(
  isAdmin: boolean,
  lojas: string[],
  perfil: RhMemberPerfil | null,
): { allowedStoreSlugs: string[] | null; lojaNaoConfigurada: boolean } {
  if (isAdmin) return { allowedStoreSlugs: null, lojaNaoConfigurada: false };
  if (perfil === 'gerente_loja' && lojas.length === 0) {
    return { allowedStoreSlugs: [], lojaNaoConfigurada: true };
  }
  if (lojas.length === 0) return { allowedStoreSlugs: null, lojaNaoConfigurada: false };
  return { allowedStoreSlugs: lojas, lojaNaoConfigurada: false };
}

export async function getCmvRealTenantFromUserId(
  actorUserId: string,
): Promise<CmvRealTenant | null> {
  const user = await prisma.user.findUnique({
    where: { id: actorUserId },
    select: { id: true, stackUserId: true },
  });
  if (!user) return null;

  const ownsTeam =
    (await prisma.rhTeamMember.count({
      where: { tenantUserId: user.id, isActive: true },
    })) > 0;

  let tenantUserId = user.id;
  let isAdmin = ownsTeam;
  let memberId: string | null = null;
  let lojas: string[] = [];
  let perfil: RhMemberPerfil | null = null;

  if (!ownsTeam && user.stackUserId) {
    const membership = await prisma.rhTeamMember.findFirst({
      where: { stackUserId: user.stackUserId, isActive: true },
      select: { id: true, tenantUserId: true, lojas: true, perfil: true },
    });
    if (membership) {
      tenantUserId = membership.tenantUserId;
      isAdmin = false;
      memberId = membership.id;
      lojas = membership.lojas ?? [];
      perfil = parsePerfil(membership.perfil);
    } else {
      isAdmin = true;
    }
  }

  const scope = storeScope(isAdmin, lojas, perfil);
  return {
    tenantUserId,
    actorUserId: user.id,
    isAdmin,
    userIds: await memberUserIds(tenantUserId),
    ...scope,
    perfil,
    memberId,
  };
}

export async function getCmvRealTenantFromSession(): Promise<CmvRealTenant | null> {
  const ctx = await getRhContext();
  if (!ctx) return null;
  return buildTenantFromRhContext(ctx);
}

export async function getCmvRealTenant(): Promise<CmvRealTenant | null> {
  return getCmvRealTenantFromSession();
}

async function buildTenantFromRhContext(ctx: RhContext): Promise<CmvRealTenant> {
  const actor = await prisma.user.findFirst({
    where: { stackUserId: ctx.stackUserId },
    select: { id: true },
  });

  let lojas: string[] = [];
  let perfil: RhMemberPerfil | null = null;
  const memberId = ctx.memberId;

  if (ctx.memberId) {
    const member = await prisma.rhTeamMember.findUnique({
      where: { id: ctx.memberId },
      select: { lojas: true, perfil: true },
    });
    lojas = member?.lojas ?? [];
    perfil = parsePerfil(member?.perfil);
  }

  const scope = storeScope(ctx.isAdmin, lojas, perfil);
  return {
    tenantUserId: ctx.userId,
    actorUserId: actor?.id ?? ctx.userId,
    isAdmin: ctx.isAdmin,
    userIds: await memberUserIds(ctx.userId),
    ...scope,
    perfil,
    memberId,
  };
}

export async function requireCmvRealTenantFromSession(): Promise<
  CmvRealTenant | NextResponse
> {
  const t = await getCmvRealTenantFromSession();
  if (!t) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  return t;
}

export type CmvRealAccessOk = {
  ctx: RhContext;
  tenant: CmvRealTenant;
  error: null;
};

export type CmvRealAccessErr = {
  ctx: null;
  tenant: null;
  error: NextResponse;
};

/**
 * Autentica + checa permissão cmv_real.* + escopo de loja.
 */
export async function requireCmvRealAccess(
  permission: RhPermissionKey | string,
  storeSlug?: string | null,
): Promise<CmvRealAccessOk | CmvRealAccessErr> {
  const ctx = await getRhContext();
  if (!ctx) {
    return {
      ctx: null,
      tenant: null,
      error: NextResponse.json(
        {
          error: 'Sessão expirada. Por favor, faça login novamente.',
          code: 'UNAUTHENTICATED',
        },
        { status: 401 },
      ),
    };
  }

  if (!ctx.isAdmin && !ctx.hasPermission(permission)) {
    return {
      ctx: null,
      tenant: null,
      error: NextResponse.json(
        { error: 'Sem permissão para esta ação', code: 'FORBIDDEN', permission },
        { status: 403 },
      ),
    };
  }

  const tenant = await buildTenantFromRhContext(ctx);

  if (tenant.lojaNaoConfigurada) {
    return {
      ctx: null,
      tenant: null,
      error: NextResponse.json(
        {
          error:
            'Loja não configurada. Peça ao administrador para definir a loja deste usuário.',
          code: 'LOJA_NAO_CONFIGURADA',
        },
        { status: 403 },
      ),
    };
  }

  if (storeSlug) {
    if (
      !tenant.isAdmin &&
      tenant.allowedStoreSlugs !== null &&
      !tenant.allowedStoreSlugs.includes(storeSlug)
    ) {
      return {
        ctx: null,
        tenant: null,
        error: NextResponse.json(
          { error: `Sem acesso à loja "${storeSlug}"`, code: 'LOJA_FORBIDDEN' },
          { status: 403 },
        ),
      };
    }
  }

  return { ctx, tenant, error: null };
}

/**
 * Filtro para listagens: null = sem filtro (todas);
 * string[] = where storeSlug in (...); [] = nada a mostrar.
 */
export function resolveCmvRealStoreFilter(
  tenant: CmvRealTenant,
  overrideSlug?: string | null,
): string[] | null {
  if (tenant.lojaNaoConfigurada) return [];
  if (overrideSlug) {
    if (tenant.isAdmin || tenant.allowedStoreSlugs === null) return [overrideSlug];
    if (tenant.allowedStoreSlugs.includes(overrideSlug)) return [overrideSlug];
    return [];
  }
  if (tenant.isAdmin || tenant.allowedStoreSlugs === null) return null;
  return tenant.allowedStoreSlugs;
}

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
