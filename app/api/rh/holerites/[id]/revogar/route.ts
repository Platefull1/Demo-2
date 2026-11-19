import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireRhPermission } from '@/lib/rh-auth';
import { P } from '@/lib/rh-permissions';
import { SystemTool } from '@/types/admin';
import { clientIp } from '@/lib/holerites/otp';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

const bodySchema = z.object({
  motivo: z.string().trim().min(10).max(500),
});

export async function POST(req: NextRequest, { params }: Ctx) {
  const { ctx, error } = await requireRhPermission(
    P.PAYSLIPS_REVOKE,
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
    return NextResponse.json(
      { error: 'Informe um motivo com pelo menos 10 caracteres.' },
      { status: 400 },
    );
  }

  const { id } = await params;
  const payslip = await prisma.payslip.findFirst({
    where: { id, userId: ctx.userId },
    select: { id: true, status: true },
  });
  if (!payslip) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  if (payslip.status === 'ACKNOWLEDGED') {
    return NextResponse.json(
      {
        error:
          'Já confirmado pelo funcionário. Para corrigir, publique um novo lote (retificação).',
      },
      { status: 409 },
    );
  }
  if (payslip.status === 'DRAFT') {
    return NextResponse.json(
      { error: 'Rascunhos se gerenciam na tela do lote.' },
      { status: 409 },
    );
  }
  if (payslip.status === 'REVOKED') {
    return NextResponse.json({ error: 'Holerite já revogado.' }, { status: 409 });
  }

  const result = await prisma.$transaction(async (tx) => {
    const updated = await tx.payslip.updateMany({
      where: {
        id: payslip.id,
        userId: ctx.userId,
        status: { in: ['PUBLISHED', 'VIEWED'] },
      },
      data: { status: 'REVOKED' },
    });
    if (updated.count === 0) {
      return false;
    }
    await tx.payslipAccessLog.create({
      data: {
        payslipId: payslip.id,
        actorType: 'rh',
        actorId: ctx.stackUserId,
        action: 'revoke',
        ip: clientIp(req),
        userAgent: req.headers.get('user-agent')?.slice(0, 500) ?? null,
        note: parsed.data.motivo,
      },
    });
    return true;
  });

  if (!result) {
    return NextResponse.json({ error: 'Não foi possível revogar.' }, { status: 409 });
  }

  return NextResponse.json({ ok: true });
}
