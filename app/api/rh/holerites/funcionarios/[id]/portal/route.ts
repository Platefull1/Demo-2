import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireRhPermission } from '@/lib/rh-auth';
import { P } from '@/lib/rh-permissions';
import { SystemTool } from '@/types/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

const bodySchema = z.object({
  action: z.enum(['revoke_sessions', 'disable', 'enable']),
});

export async function POST(req: NextRequest, { params }: Ctx) {
  const { ctx, error } = await requireRhPermission(
    P.PAYSLIPS_PORTAL_MANAGE,
    SystemTool.HOLERITES,
  );
  if (error) return error;

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: 'payload_invalido' }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: 'payload_invalido' }, { status: 400 });
  }

  const { id } = await params;
  const func = await prisma.rhFuncionario.findFirst({
    where: { id, userId: ctx.userId },
    select: {
      id: true,
      portalStatus: true,
      portalTokenVersion: true,
    },
  });
  if (!func) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  const actor = await prisma.stackUser.findUnique({
    where: { id: ctx.stackUserId },
    select: { displayName: true, primaryEmail: true },
  });
  const actorLabel = actor?.displayName || actor?.primaryEmail || ctx.stackUserId;

  if (parsed.data.action === 'revoke_sessions') {
    const updated = await prisma.rhFuncionario.update({
      where: { id: func.id },
      data: { portalTokenVersion: { increment: 1 } },
      select: { portalTokenVersion: true },
    });
    await prisma.rhHistoricoFuncionario.create({
      data: {
        userId: ctx.userId,
        funcionarioId: func.id,
        campo: 'portalTokenVersion',
        valorAnterior: String(func.portalTokenVersion),
        valorNovo: String(updated.portalTokenVersion),
        alteradoPor: actorLabel,
        motivo: `Sessões do portal encerradas por ${actorLabel}`,
      },
    });
    console.info(
      '[holerites/portal] revoke_sessions',
      JSON.stringify({ who: ctx.stackUserId, funcionarioId: func.id }),
    );
    return NextResponse.json({
      ok: true,
      portalTokenVersion: updated.portalTokenVersion,
    });
  }

  if (parsed.data.action === 'disable') {
    await prisma.$transaction([
      prisma.rhFuncionario.update({
        where: { id: func.id },
        data: {
          portalStatus: 'disabled',
          portalTokenVersion: { increment: 1 },
        },
      }),
      prisma.rhHistoricoFuncionario.create({
        data: {
          userId: ctx.userId,
          funcionarioId: func.id,
          campo: 'portalStatus',
          valorAnterior: func.portalStatus,
          valorNovo: 'disabled',
          alteradoPor: actorLabel,
          motivo: `Acesso ao portal desabilitado por ${actorLabel}`,
        },
      }),
    ]);
    console.info(
      '[holerites/portal] disable',
      JSON.stringify({ who: ctx.stackUserId, funcionarioId: func.id }),
    );
    return NextResponse.json({ ok: true, portalStatus: 'disabled' });
  }

  // enable
  await prisma.$transaction([
    prisma.rhFuncionario.update({
      where: { id: func.id },
      data: { portalStatus: 'enabled' },
    }),
    prisma.rhHistoricoFuncionario.create({
      data: {
        userId: ctx.userId,
        funcionarioId: func.id,
        campo: 'portalStatus',
        valorAnterior: func.portalStatus,
        valorNovo: 'enabled',
        alteradoPor: actorLabel,
        motivo: `Acesso ao portal habilitado por ${actorLabel}`,
      },
    }),
  ]);
  console.info(
    '[holerites/portal] enable',
    JSON.stringify({ who: ctx.stackUserId, funcionarioId: func.id }),
  );
  return NextResponse.json({ ok: true, portalStatus: 'enabled' });
}
