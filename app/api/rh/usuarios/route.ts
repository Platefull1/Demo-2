import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRhPermission } from '@/lib/rh-auth';
import {
  P,
  DEFAULT_MEMBER_PERMISSIONS,
  getPreset,
  isValidStoreSlug,
} from '@/lib/rh-permissions';

export const dynamic = 'force-dynamic';

// GET /api/rh/usuarios — lista membros da equipe (apenas Admin)
export async function GET() {
  const { ctx, error } = await requireRhPermission(P.USERS_MANAGE);
  if (error) return error;

  const members = await prisma.rhTeamMember.findMany({
    where: { tenantUserId: ctx.userId },
    include: { permissions: { select: { permission: true } } },
    orderBy: { createdAt: 'asc' },
  });

  // Migração: membros ativos sem NENHUMA permissão → default RH (sem cmv_real.*)
  for (const m of members) {
    if (m.isActive && m.permissions.length === 0) {
      await prisma.rhPermission.createMany({
        data: DEFAULT_MEMBER_PERMISSIONS.map((permission) => ({
          memberId: m.id,
          permission,
          grantedBy: ctx.stackUserId,
        })),
        skipDuplicates: true,
      });
    }
  }

  const refreshed = await prisma.rhTeamMember.findMany({
    where: { tenantUserId: ctx.userId },
    include: { permissions: { select: { permission: true } } },
    orderBy: { createdAt: 'asc' },
  });

  return NextResponse.json(
    refreshed.map((m) => ({
      id: m.id,
      email: m.email,
      displayName: m.displayName,
      isActive: m.isActive,
      stackUserId: m.stackUserId,
      acceptedAt: m.stackUserId ? m.updatedAt : null,
      createdAt: m.createdAt,
      lojas: m.lojas,
      perfil: m.perfil,
      permissions: m.permissions.map((p) => p.permission),
    })),
  );
}

// POST /api/rh/usuarios — convidar novo membro (apenas Admin)
export async function POST(req: NextRequest) {
  const { ctx, error } = await requireRhPermission(P.USERS_MANAGE);
  if (error) return error;

  const body = (await req.json()) as {
    email: string;
    displayName?: string;
    preset?: 'escritorio' | 'gerente_loja';
    lojas?: string[];
  };

  if (!body.email) {
    return NextResponse.json({ error: 'E-mail obrigatório' }, { status: 400 });
  }

  const email = body.email.trim().toLowerCase();

  const existing = await prisma.rhTeamMember.findUnique({
    where: { tenantUserId_email: { tenantUserId: ctx.userId, email } },
  });

  if (existing) {
    if (existing.isActive) {
      return NextResponse.json({ error: 'Usuário já convidado com este e-mail' }, { status: 409 });
    }
    const reativado = await prisma.rhTeamMember.update({
      where: { id: existing.id },
      data: { isActive: true, displayName: body.displayName ?? existing.displayName },
    });
    return NextResponse.json({ id: reativado.id, email: reativado.email, reativado: true });
  }

  const preset = body.preset ? getPreset(body.preset) : null;
  const lojasRaw = Array.isArray(body.lojas) ? body.lojas.filter(isValidStoreSlug) : [];
  const lojas = preset?.lojasMode === 'todas' ? [] : lojasRaw;

  if (preset?.lojasMode === 'required' && lojas.length === 0) {
    return NextResponse.json(
      { error: 'Perfil Gerente de loja exige ao menos uma loja' },
      { status: 400 },
    );
  }

  const member = await prisma.rhTeamMember.create({
    data: {
      tenantUserId: ctx.userId,
      email,
      displayName: body.displayName?.trim() || null,
      invitedBy: ctx.stackUserId,
      lojas,
      perfil: preset?.id ?? null,
    },
  });

  const perms = new Set<string>(DEFAULT_MEMBER_PERMISSIONS);
  if (preset) {
    for (const p of preset.cmvRealPermissions) perms.add(p);
  }

  await prisma.rhPermission.createMany({
    data: [...perms].map((permission) => ({
      memberId: member.id,
      permission,
      grantedBy: ctx.stackUserId,
    })),
    skipDuplicates: true,
  });

  return NextResponse.json({
    id: member.id,
    email: member.email,
    perfil: member.perfil,
    lojas: member.lojas,
  });
}
