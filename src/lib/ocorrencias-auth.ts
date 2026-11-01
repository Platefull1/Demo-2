/**
 * Contexto de autenticação para o módulo Central de Ocorrências.
 *
 * Separado do módulo de reclamações. Reutiliza só o cadastro de lojas/motoboys
 * (tenant = User.id) e, quando o login é membro de equipe RH, resolve o dono
 * dos dados — senão os 4 logins de loja não veriam as lojas da empresa.
 */

import { NextResponse } from 'next/server';
import { stackServerApp } from '@/stack';
import { syncStackAuthUser } from '@/lib/stack-auth-sync';
import { prisma } from '@/lib/prisma';
import { isOcorrenciasOnlyTools } from '@/lib/auth/tool-access';
import { P } from '@/lib/rh-permissions';
import { SystemTool } from '@/types/admin';

export interface OcorrenciasContext {
  /** User.id do tenant (dono dos dados / companyId) */
  userId: string;
  /** Stack Auth ID de quem está agindo (criadoPorUserId) */
  stackUserId: string;
  canRegister: boolean;
  canView: boolean;
  isTenantOwner: boolean;
}

type StackLike = {
  id: string;
  primaryEmail?: string | null;
  displayName?: string | null;
};

/**
 * Resolve o User.id da empresa: dono da equipe, membro RH ativo, ou o próprio User.
 */
export async function resolveOcorrenciasTenant(
  stackUser: StackLike,
  dbUserId: string,
): Promise<{ tenantUserId: string; isTenantOwner: boolean }> {
  const ownsTeam =
    (await prisma.rhTeamMember.count({
      where: { tenantUserId: dbUserId, isActive: true },
    })) > 0;

  if (ownsTeam) {
    return { tenantUserId: dbUserId, isTenantOwner: true };
  }

  const membership = await prisma.rhTeamMember.findFirst({
    where: { stackUserId: stackUser.id, isActive: true },
  });
  if (membership && membership.tenantUserId !== dbUserId) {
    return { tenantUserId: membership.tenantUserId, isTenantOwner: false };
  }

  if (stackUser.primaryEmail) {
    const pending = await prisma.rhTeamMember.findFirst({
      where: {
        email: stackUser.primaryEmail.toLowerCase(),
        stackUserId: null,
        isActive: true,
        NOT: { tenantUserId: dbUserId },
      },
    });
    if (pending) {
      await prisma.rhTeamMember.update({
        where: { id: pending.id },
        data: {
          stackUserId: stackUser.id,
          displayName: stackUser.displayName ?? undefined,
        },
      });
      return { tenantUserId: pending.tenantUserId, isTenantOwner: false };
    }
  }

  const hasLojas =
    (await prisma.rhLoja.count({ where: { userId: dbUserId } })) > 0;
  return { tenantUserId: dbUserId, isTenantOwner: hasLojas };
}

/** Tag RH `ocorrencias.registrar` no membro ativo (mesmo tenant ou pendente já vinculado). */
export async function memberHasRegistrarOcorrenciaTag(
  stackUserId: string,
): Promise<boolean> {
  const membership = await prisma.rhTeamMember.findFirst({
    where: { stackUserId, isActive: true },
    select: {
      permissions: { select: { permission: true } },
    },
  });
  return (
    membership?.permissions.some((p) => p.permission === P.OCORRENCIAS_REGISTRAR) ===
    true
  );
}

/** Liga/desliga a ferramenta de sistema a partir da tag do membro. */
export async function syncRegistrarOcorrenciasTool(
  stackUserId: string | null | undefined,
  enabled: boolean,
): Promise<void> {
  if (!stackUserId) return;
  await prisma.userToolPermission.upsert({
    where: {
      stackUserId_tool: {
        stackUserId,
        tool: SystemTool.REGISTRAR_OCORRENCIAS,
      },
    },
    update: { isEnabled: enabled },
    create: {
      stackUserId,
      tool: SystemTool.REGISTRAR_OCORRENCIAS,
      isEnabled: enabled,
    },
  });
}

/** Dono das lojas / equipe. Usado no isolamento; não concede ferramenta. */
export async function isOcorrenciasTenantAdmin(
  stackUserId: string,
): Promise<boolean> {
  const su = await prisma.stackUser.findUnique({
    where: { id: stackUserId },
    select: { userId: true, primaryEmail: true, displayName: true },
  });
  if (!su?.userId) return false;
  const { isTenantOwner } = await resolveOcorrenciasTenant(
    { id: stackUserId, primaryEmail: su.primaryEmail, displayName: su.displayName },
    su.userId,
  );
  return isTenantOwner;
}

export async function getOcorrenciasContext(): Promise<OcorrenciasContext | null> {
  const stackUser = await stackServerApp.getUser({ or: 'return-null' });
  if (!stackUser) return null;

  const dbUser = await syncStackAuthUser({
    id: stackUser.id,
    primaryEmail: stackUser.primaryEmail || undefined,
    displayName: stackUser.displayName || undefined,
    profileImageUrl: stackUser.profileImageUrl || undefined,
    primaryEmailVerified: stackUser.primaryEmailVerified ? new Date() : null,
  });
  if (!dbUser) return null;

  const { tenantUserId, isTenantOwner } = await resolveOcorrenciasTenant(
    {
      id: stackUser.id,
      primaryEmail: stackUser.primaryEmail,
      displayName: stackUser.displayName,
    },
    dbUser.id,
  );

  const [regPerm, verPerm] = await Promise.all([
    prisma.userToolPermission.findUnique({
      where: {
        stackUserId_tool: {
          stackUserId: stackUser.id,
          tool: SystemTool.REGISTRAR_OCORRENCIAS,
        },
      },
    }),
    prisma.userToolPermission.findUnique({
      where: {
        stackUserId_tool: {
          stackUserId: stackUser.id,
          tool: SystemTool.VER_OCORRENCIAS,
        },
      },
    }),
  ]);

  const hasRhRegistrarTag = await memberHasRegistrarOcorrenciaTag(stackUser.id);
  if (hasRhRegistrarTag && regPerm?.isEnabled !== true) {
    await syncRegistrarOcorrenciasTool(stackUser.id, true);
  }

  const canRegister = regPerm?.isEnabled === true || hasRhRegistrarTag;
  const canView = verPerm?.isEnabled === true;

  if (!canRegister && !canView) return null;

  return {
    userId: tenantUserId,
    stackUserId: stackUser.id,
    canRegister,
    canView,
    isTenantOwner,
  };
}

export async function requireOcorrenciasContext(
  requirePermission: 'REGISTRAR' | 'VER' | 'ANY',
): Promise<
  | { ctx: OcorrenciasContext; error: null }
  | { ctx: null; error: NextResponse }
> {
  const ctx = await getOcorrenciasContext();

  if (!ctx) {
    return {
      ctx: null,
      error: NextResponse.json(
        { error: 'Sessão expirada ou sem permissão para acessar ocorrências' },
        { status: 401 },
      ),
    };
  }

  if (requirePermission === 'REGISTRAR' && !ctx.canRegister) {
    return {
      ctx: null,
      error: NextResponse.json(
        { error: 'Sem permissão para registrar ocorrências' },
        { status: 403 },
      ),
    };
  }

  if (requirePermission === 'VER' && !ctx.canView) {
    return {
      ctx: null,
      error: NextResponse.json(
        { error: 'Sem permissão para visualizar ocorrências' },
        { status: 403 },
      ),
    };
  }

  return { ctx, error: null };
}

/**
 * Dono da equipe (tem membros). Não usa "tem loja no próprio User" —
 * membro novo com loja espelhada não pode virar admin e cair no painel.
 */
export async function isOcorrenciasTeamOwner(stackUserId: string): Promise<boolean> {
  const su = await prisma.stackUser.findUnique({
    where: { id: stackUserId },
    select: { userId: true },
  });
  if (!su?.userId) return false;
  const ownsTeam =
    (await prisma.rhTeamMember.count({
      where: { tenantUserId: su.userId, isActive: true },
    })) > 0;
  return ownsTeam;
}

/**
 * Só registra ocorrência (sem VER). Admin da empresa nunca entra neste modo.
 * Membro novo com a tag registrar (+ RH do convite) vê a mesma tela dos antigos.
 */
export async function isOcorrenciasOnlyUser(): Promise<boolean> {
  const stackUser = await stackServerApp.getUser({ or: 'return-null' });
  if (!stackUser) return false;

  if (await isOcorrenciasTeamOwner(stackUser.id)) return false;

  const [allPerms, hasRhRegistrarTag] = await Promise.all([
    prisma.userToolPermission.findMany({
      where: { stackUserId: stackUser.id, isEnabled: true },
      select: { tool: true },
    }),
    memberHasRegistrarOcorrenciaTag(stackUser.id),
  ]);

  const tools = allPerms.map((p) => p.tool);
  if (hasRhRegistrarTag && !tools.includes(SystemTool.REGISTRAR_OCORRENCIAS)) {
    tools.push(SystemTool.REGISTRAR_OCORRENCIAS);
  }

  if (tools.length === 0) return false;

  return isOcorrenciasOnlyTools(tools);
}
