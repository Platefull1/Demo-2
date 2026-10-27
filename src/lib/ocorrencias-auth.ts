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

/** Admin da empresa (dono das lojas / equipe) — tem as duas permissões por padrão. */
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

  const canRegister =
    regPerm?.isEnabled === true || isTenantOwner;
  const canView = verPerm?.isEnabled === true || isTenantOwner;

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
 * Só REGISTRAR_OCORRENCIAS (sem VER e sem qualquer outra ferramenta).
 * Admin da empresa nunca entra neste modo.
 */
export async function isOcorrenciasOnlyUser(): Promise<boolean> {
  const stackUser = await stackServerApp.getUser({ or: 'return-null' });
  if (!stackUser) return false;

  if (await isOcorrenciasTenantAdmin(stackUser.id)) return false;

  const allPerms = await prisma.userToolPermission.findMany({
    where: { stackUserId: stackUser.id, isEnabled: true },
    select: { tool: true },
  });

  if (allPerms.length === 0) return false;

  const tools = allPerms.map((p) => p.tool);
  return (
    tools.includes(SystemTool.REGISTRAR_OCORRENCIAS) &&
    !tools.includes(SystemTool.VER_OCORRENCIAS) &&
    tools.every((t) => t === SystemTool.REGISTRAR_OCORRENCIAS)
  );
}
