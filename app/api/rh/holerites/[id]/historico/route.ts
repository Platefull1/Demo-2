import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRhPermission } from '@/lib/rh-auth';
import { P } from '@/lib/rh-permissions';
import { SystemTool } from '@/types/admin';
import { maskIpLastOctet } from '@/lib/holerites/rh-panel';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { ctx, error } = await requireRhPermission(
    P.PAYSLIPS_VIEW,
    SystemTool.HOLERITES,
  );
  if (error) return error;

  const { id } = await params;
  const payslip = await prisma.payslip.findFirst({
    where: { id, userId: ctx.userId },
    select: { id: true },
  });
  if (!payslip) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  const logs = await prisma.payslipAccessLog.findMany({
    where: { payslipId: id },
    orderBy: { createdAt: 'desc' },
    take: 200,
    select: {
      id: true,
      actorType: true,
      actorId: true,
      action: true,
      ip: true,
      note: true,
      createdAt: true,
    },
  });

  const rhActorIds = [
    ...new Set(logs.filter((l) => l.actorType === 'rh').map((l) => l.actorId)),
  ];
  const names = new Map<string, string>();
  if (rhActorIds.length) {
    const members = await prisma.stackUser.findMany({
      where: { id: { in: rhActorIds } },
      select: { id: true, displayName: true, primaryEmail: true },
    });
    for (const m of members) {
      names.set(m.id, m.displayName || m.primaryEmail || m.id);
    }
  }

  return NextResponse.json({
    items: logs.map((l) => ({
      id: l.id,
      actorType: l.actorType,
      actorId: l.actorId,
      actorName:
        l.actorType === 'rh'
          ? (names.get(l.actorId) ?? l.actorId)
          : l.actorType === 'employee'
            ? 'Colaborador'
            : l.actorId,
      action: l.action,
      ip: maskIpLastOctet(l.ip),
      note: l.note,
      createdAt: l.createdAt.toISOString(),
    })),
  });
}
