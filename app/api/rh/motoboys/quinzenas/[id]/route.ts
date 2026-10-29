import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { rhRequireModuleUser } from '@/lib/rh-auth';
import { canRhDeleteQuinzena } from '@/lib/rider-quinzena-docs';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const rh = await rhRequireModuleUser();
  if (!rh) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  const { id } = await params;
  const period = await prisma.riderPaymentPeriod.findFirst({
    where: { id, userId: rh.userId },
    include: {
      rider: { select: { name: true, email: true, lojaId: true } },
      documents: {
        select: { id: true, documentType: true, status: true, fileName: true, storagePath: true, uploadedAt: true, reviewedAt: true },
      },
    },
  });

  if (!period) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 });
  return NextResponse.json(period);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const rh = await rhRequireModuleUser();
  if (!rh) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  const { id } = await params;
  const body = await req.json() as {
    status?: string;
    periodLabel?: string;
    periodStart?: string;
    periodEnd?: string;
    deliveryCount?: number;
    amountCents?: number;
    dailyRateCents?: number;
    discountCents?: number;
    discountNotes?: string | null;
    summary?: string | null;
  };

  const result = await prisma.riderPaymentPeriod.updateMany({
    where: { id, userId: rh.userId },
    data: {
      ...(body.status        !== undefined && { status: body.status }),
      ...(body.periodLabel   !== undefined && { periodLabel: body.periodLabel }),
      ...(body.periodStart   !== undefined && { periodStart: new Date(body.periodStart) }),
      ...(body.periodEnd     !== undefined && { periodEnd: new Date(body.periodEnd) }),
      ...(body.deliveryCount !== undefined && { deliveryCount: body.deliveryCount }),
      ...(body.amountCents   !== undefined && { amountCents: body.amountCents }),
      ...(body.dailyRateCents !== undefined && { dailyRateCents: body.dailyRateCents }),
      ...(body.discountCents !== undefined && { discountCents: body.discountCents }),
      ...(body.discountNotes !== undefined && { discountNotes: body.discountNotes }),
      ...(body.summary       !== undefined && { summary: body.summary }),
    },
  });

  if (result.count === 0) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const rh = await rhRequireModuleUser();
  if (!rh) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  const { id } = await params;
  const period = await prisma.riderPaymentPeriod.findFirst({
    where: { id, userId: rh.userId },
    include: { documents: { select: { id: true } } },
  });

  if (!period) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 });

  if (!canRhDeleteQuinzena(period)) {
    if (period.status === 'paid') {
      return NextResponse.json(
        { error: 'Quinzena já paga — não é possível excluir' },
        { status: 409 },
      );
    }
    if (period.documents.length > 0) {
      return NextResponse.json(
        { error: 'Há documentos enviados nesta quinzena. Exclua os documentos antes de apagar o lançamento.' },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: 'Só é possível excluir quinzenas que ainda aguardam documentos' },
      { status: 409 },
    );
  }

  await prisma.riderPaymentPeriod.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
