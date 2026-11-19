import { NextRequest, NextResponse } from 'next/server';
import { requireRhPermission } from '@/lib/rh-auth';
import { P } from '@/lib/rh-permissions';
import { SystemTool } from '@/types/admin';
import { checkRateLimit } from '@/lib/rate-limit';
import { reenviarAvisoHolerite } from '@/lib/holerites/publish';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

export async function POST(_req: NextRequest, { params }: Ctx) {
  const { ctx, error } = await requireRhPermission(
    P.PAYSLIPS_PUBLISH,
    SystemTool.HOLERITES,
  );
  if (error) return error;

  const { id } = await params;

  const rl = await checkRateLimit({
    key: `notify:payslip:${id}`,
    limit: 1,
    windowSeconds: 10 * 60,
  });
  if (!rl.allowed) {
    return NextResponse.json(
      {
        error: 'Aguarde alguns minutos antes de reenviar.',
        retryAfterSeconds: rl.retryAfterSeconds,
      },
      { status: 429 },
    );
  }

  try {
    const result = await reenviarAvisoHolerite({
      payslipId: id,
      userId: ctx.userId,
    });
    return NextResponse.json(result);
  } catch (err) {
    const status = (err as { status?: number })?.status ?? 500;
    if (status === 404 || status === 422 || status === 409 || status === 502) {
      return NextResponse.json(
        { error: err instanceof Error ? err.message : 'Erro' },
        { status },
      );
    }
    console.error('[rh/reenviar-aviso]', err);
    return NextResponse.json({ error: 'Falha ao reenviar' }, { status: 500 });
  }
}
