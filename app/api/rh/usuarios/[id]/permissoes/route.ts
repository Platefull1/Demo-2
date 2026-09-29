import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRhPermission } from '@/lib/rh-auth';
import {
  P,
  ADMIN_ONLY_PERMISSIONS,
  DEFAULT_MEMBER_PERMISSIONS,
  PERMISSION_GROUPS,
  CMV_REAL_PERMISSIONS,
  getPreset,
  isValidStoreSlug,
  type RhMemberPerfil,
} from '@/lib/rh-permissions';

export const dynamic = 'force-dynamic';

// GET /api/rh/usuarios/[id]/permissoes
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { ctx, error } = await requireRhPermission(P.USERS_MANAGE);
  if (error) return error;

  const { id } = await params;
  const member = await prisma.rhTeamMember.findFirst({
    where: { id, tenantUserId: ctx.userId },
    include: { permissions: true },
  });
  if (!member) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 });

  // Migração: zero permissões → default RH (sem cmv_real)
  if (member.permissions.length === 0) {
    await prisma.rhPermission.createMany({
      data: DEFAULT_MEMBER_PERMISSIONS.map((permission) => ({
        memberId: member.id,
        permission,
        grantedBy: ctx.stackUserId,
      })),
      skipDuplicates: true,
    });
    const created = await prisma.rhPermission.findMany({ where: { memberId: member.id } });
    member.permissions.push(...created);
  }

  const activePerms = new Set(member.permissions.map((p) => p.permission));

  const groups = PERMISSION_GROUPS.map((g) => ({
    label: g.label,
    permissions: g.permissions.map((perm) => ({
      permission: perm,
      active: activePerms.has(perm),
    })),
  }));

  return NextResponse.json({
    memberId: member.id,
    email: member.email,
    displayName: member.displayName,
    lojas: member.lojas,
    perfil: member.perfil,
    groups,
  });
}

// POST /api/rh/usuarios/[id]/permissoes
// - toggle: { permission, active } — NÃO altera perfil
// - apply_preset: { action:'apply_preset', preset, lojas? }
// - set_lojas: { action:'set_lojas', lojas }
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { ctx, error } = await requireRhPermission(P.USERS_MANAGE);
  if (error) return error;

  const { id } = await params;
  const body = (await req.json()) as {
    action?: string;
    permission?: string;
    active?: boolean;
    preset?: RhMemberPerfil;
    lojas?: string[];
  };

  const member = await prisma.rhTeamMember.findFirst({
    where: { id, tenantUserId: ctx.userId },
  });
  if (!member) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 });

  if (body.action === 'set_lojas') {
    const lojas = (body.lojas ?? []).filter(isValidStoreSlug);
    if (member.perfil === 'gerente_loja' && lojas.length === 0) {
      return NextResponse.json(
        { error: 'Gerente de loja exige ao menos uma loja' },
        { status: 400 },
      );
    }
    const updated = await prisma.rhTeamMember.update({
      where: { id },
      data: { lojas },
    });
    return NextResponse.json({ ok: true, lojas: updated.lojas, perfil: updated.perfil });
  }

  if (body.action === 'apply_preset') {
    const preset = body.preset ? getPreset(body.preset) : null;
    if (!preset) {
      return NextResponse.json({ error: 'preset inválido' }, { status: 400 });
    }

    let lojas: string[];
    if (preset.lojasMode === 'todas') {
      lojas = [];
    } else {
      lojas = (body.lojas ?? member.lojas ?? []).filter(isValidStoreSlug);
      if (lojas.length === 0) {
        return NextResponse.json(
          { error: 'Perfil Gerente de loja exige ao menos uma loja' },
          { status: 400 },
        );
      }
    }

    // Substitui só as permissões cmv_real.*; demais RH intactas. perfil = informativo.
    await prisma.$transaction(async (tx) => {
      await tx.rhPermission.deleteMany({
        where: {
          memberId: id,
          permission: { in: [...CMV_REAL_PERMISSIONS] },
        },
      });
      if (preset.cmvRealPermissions.length > 0) {
        await tx.rhPermission.createMany({
          data: preset.cmvRealPermissions.map((permission) => ({
            memberId: id,
            permission,
            grantedBy: ctx.stackUserId,
          })),
          skipDuplicates: true,
        });
      }
      await tx.rhTeamMember.update({
        where: { id },
        data: { perfil: preset.id, lojas },
      });
    });

    return NextResponse.json({
      ok: true,
      perfil: preset.id,
      lojas,
      cmvRealPermissions: preset.cmvRealPermissions,
    });
  }

  // Toggle individual — não mexe em perfil
  if (!body.permission) {
    return NextResponse.json({ error: 'permission obrigatório' }, { status: 400 });
  }
  if (ADMIN_ONLY_PERMISSIONS.has(body.permission)) {
    return NextResponse.json(
      { error: 'Permissão não pode ser concedida a usuários RH' },
      { status: 403 },
    );
  }

  if (body.active) {
    await prisma.rhPermission.upsert({
      where: { memberId_permission: { memberId: id, permission: body.permission } },
      create: {
        memberId: id,
        permission: body.permission,
        grantedBy: ctx.stackUserId,
      },
      update: { grantedBy: ctx.stackUserId, grantedAt: new Date() },
    });
  } else {
    await prisma.rhPermission.deleteMany({
      where: { memberId: id, permission: body.permission },
    });
  }

  return NextResponse.json({ ok: true, permission: body.permission, active: body.active });
}
