import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getEstoqueTenantContext } from '@/lib/estoque-tenant';

export const dynamic = 'force-dynamic';

// ── PATCH: atualiza nome / unidade de um insumo ──────────────────────────────
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const ctx = await getEstoqueTenantContext();
    if (!ctx) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const { userIds } = ctx;

    const { id } = await params;
    const body = await req.json();
    const { nome, unidade } = body;

    const existing = await prisma.estoqueInsumo.findFirst({
      where: { id, userId: { in: userIds } },
    });
    if (!existing) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 });

    const updated = await prisma.estoqueInsumo.update({
      where: { id },
      data: {
        ...(nome ? { nome: nome.trim().toUpperCase() } : {}),
        ...(unidade ? { unidade: unidade.trim() } : {}),
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error('[PATCH /api/estoque/insumos/[id]]', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

// ── DELETE: remove um insumo ──────────────────────────────────────────────────
// A lista da UI faz merge multi-conta + dedupe por slug (insumoId).
// Por isso apagamos TODAS as cópias desse slug no tenant — senão o GET
// devolve a cópia de outro membro e o produto "volta" após a exclusão.
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const ctx = await getEstoqueTenantContext();
    if (!ctx) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const { userIds } = ctx;

    const { id } = await params;

    const existing = await prisma.estoqueInsumo.findFirst({
      where: { id, userId: { in: userIds } },
    });
    if (!existing) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 });

    // Cópias com mesmo nome (criadas uma vez por loja) e mesmo slug
    const duplicatas = await prisma.estoqueInsumo.findMany({
      where: {
        userId: { in: userIds },
        OR: [{ insumoId: existing.insumoId }, { nome: existing.nome }],
      },
      select: { id: true, insumoId: true },
    });
    const slugs = [...new Set(duplicatas.map(d => d.insumoId))];

    await prisma.estoqueInsumo.deleteMany({
      where: { id: { in: duplicatas.map(d => d.id) } },
    });

    // Limpa configs ligadas a qualquer slug dessas cópias
    await prisma.estoqueProdutoConfig.deleteMany({
      where: { userId: { in: userIds }, produtoId: { in: slugs } },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[DELETE /api/estoque/insumos/[id]]', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
