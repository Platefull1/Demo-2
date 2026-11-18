import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRhPermission, type RhContext } from '@/lib/rh-auth';
import { P } from '@/lib/rh-permissions';

export const dynamic = 'force-dynamic';

function canAccess(ctx: RhContext) {
  return (
    ctx.isAdmin ||
    ctx.hasPermission(P.EMPLOYEES_EDIT) ||
    ctx.hasPermission(P.EMPLOYEES_DEACTIVATE)
  );
}

/**
 * GET /api/rh/rescisoes?status=RASCUNHO|FINALIZADA
 * Lista leve para a aba Funcionários + permissões do usuário.
 */
export async function GET(req: NextRequest) {
  try {
    const { ctx, error } = await requireRhPermission();
    if (error) return error;
    if (!canAccess(ctx!)) {
      return NextResponse.json({ error: 'Sem permissão para esta ação' }, { status: 403 });
    }

    const status = req.nextUrl.searchParams.get('status') ?? 'RASCUNHO';
    if (status !== 'RASCUNHO' && status !== 'FINALIZADA') {
      return NextResponse.json({ error: 'status inválido' }, { status: 400 });
    }

    const items = await prisma.rhRescisao.findMany({
      where: {
        status,
        funcionario: { userId: ctx!.userId },
      },
      select: {
        id: true,
        funcionarioId: true,
        status: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({
      items,
      permissions: {
        canEdit: ctx!.isAdmin || ctx!.hasPermission(P.EMPLOYEES_EDIT),
        canFinalize: ctx!.isAdmin || ctx!.hasPermission(P.EMPLOYEES_DEACTIVATE),
      },
    });
  } catch (err) {
    console.error('[GET /api/rh/rescisoes]', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
