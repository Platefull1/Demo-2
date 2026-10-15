import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getEstoqueTenantContext } from '@/lib/estoque-tenant';
import { canAccessLojaNome } from '@/lib/store-access';
import type { StockSession } from '../../../../estoque/types';

export const dynamic = 'force-dynamic';

function notFound() {
  return NextResponse.json({ error: 'Não encontrado' }, { status: 404 });
}

async function loadAccessibleContagem(id: string) {
  const ctx = await getEstoqueTenantContext();
  if (!ctx) return { ctx: null as null, existing: null, error: NextResponse.json({ error: 'Não autorizado' }, { status: 401 }) };
  if (ctx.store.lojaNaoConfigurada) {
    return { ctx, existing: null, error: notFound() };
  }

  const existing = await prisma.estoqueContagem.findUnique({ where: { id } });
  if (!existing || !ctx.userIds.includes(existing.userId)) {
    return { ctx, existing: null, error: notFound() };
  }
  if (!canAccessLojaNome(ctx.store, existing.lojaNome)) {
    return { ctx, existing: null, error: notFound() };
  }
  return { ctx, existing, error: null };
}

// ── PATCH: atualizar sessões e/ou status ──────────────────────────────────────
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { existing, error } = await loadAccessibleContagem(id);
    if (error) return error;
    if (!existing) return notFound();

    const body = await request.json();

    const updated = await prisma.estoqueContagem.update({
      where: { id },
      data: {
        ...(body.sessoes !== undefined && { sessoes: body.sessoes }),
        ...(body.status !== undefined && { status: body.status }),
      },
    });

    const session: StockSession = {
      id: updated.id,
      dataCriacao: updated.dataCriacao.toISOString(),
      status: updated.status as 'em_andamento' | 'concluida',
      sessoes: updated.sessoes as unknown as StockSession['sessoes'],
      criadoPor: updated.criadoPor,
      lojaNome: updated.lojaNome,
    };

    return NextResponse.json(session);
  } catch (error) {
    console.error('❌ Estoque PATCH error:', error);
    return NextResponse.json({ error: 'Erro ao atualizar contagem' }, { status: 500 });
  }
}

// ── DELETE: excluir contagem ──────────────────────────────────────────────────
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { existing, error } = await loadAccessibleContagem(id);
    if (error) return error;
    if (!existing) return notFound();

    await prisma.estoqueContagem.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Estoque DELETE error:', error);
    return NextResponse.json({ error: 'Erro ao excluir contagem' }, { status: 500 });
  }
}
