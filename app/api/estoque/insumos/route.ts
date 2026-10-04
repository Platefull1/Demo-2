import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { dedupeInsumosByNome, slugifyInsumoNome } from '@/lib/estoque-nome';
import {
  dedupeInsumosBySlug,
  getEstoqueTenantContext,
} from '@/lib/estoque-tenant';
import { INSUMOS_PADRAO } from '@/lib/estoque-insumos-padrao';

export const dynamic = 'force-dynamic';

// ── GET: lista insumos do tenant; faz seed automático se ainda não tem nenhum ──
export async function GET() {
  try {
    const ctx = await getEstoqueTenantContext();
    if (!ctx) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const { tenantUserId, userIds } = ctx;

    let insumos = await prisma.estoqueInsumo.findMany({
      where: { userId: { in: userIds } },
      orderBy: [{ categoriaId: 'asc' }, { createdAt: 'asc' }],
    });

    insumos = dedupeInsumosBySlug(insumos, tenantUserId);
    // Evita "triplicar" o mesmo produto criado uma vez por loja (slugs diferentes, mesmo nome)
    insumos = dedupeInsumosByNome(insumos, tenantUserId);

    // Seed automático na primeira vez que o tenant acessa (nenhum membro tem dados)
    if (insumos.length === 0) {
      await prisma.estoqueInsumo.createMany({
        data: INSUMOS_PADRAO.map(p => ({
          userId: tenantUserId,
          insumoId: p.insumoId,
          nome: p.nome,
          unidade: p.unidade,
          categoriaId: p.categoriaId,
          categoriaNome: p.categoriaNome,
          categoriaIcone: p.categoriaIcone,
        })),
        skipDuplicates: true,
      });

      insumos = await prisma.estoqueInsumo.findMany({
        where: { userId: tenantUserId },
        orderBy: [{ categoriaId: 'asc' }, { createdAt: 'asc' }],
      });
    }

    return NextResponse.json(insumos);
  } catch (err) {
    console.error('[GET /api/estoque/insumos]', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

// ── POST: cria novo insumo ────────────────────────────────────────────────────
// Catálogo é compartilhado entre lojas do tenant — não criar o mesmo nome de novo.
export async function POST(req: NextRequest) {
  try {
    const ctx = await getEstoqueTenantContext();
    if (!ctx) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const { tenantUserId, userIds } = ctx;

    const body = await req.json();
    const { nome, unidade, categoriaId, categoriaNome, categoriaIcone } = body;

    if (!nome?.trim() || !unidade?.trim() || !categoriaId?.trim()) {
      return NextResponse.json({ error: 'nome, unidade e categoriaId são obrigatórios' }, { status: 400 });
    }

    const nomeFinal = nome.trim().toUpperCase();

    const jaExiste = await prisma.estoqueInsumo.findFirst({
      where: { userId: { in: userIds }, nome: nomeFinal },
    });
    if (jaExiste) {
      return NextResponse.json(
        {
          error:
            'Este produto já está na lista. O catálogo é compartilhado entre todas as lojas — basta adicionar uma vez.',
        },
        { status: 409 },
      );
    }

    const baseSlug = slugifyInsumoNome(nomeFinal) || `produto-${Date.now()}`;
    const slugTaken = await prisma.estoqueInsumo.findFirst({
      where: { userId: { in: userIds }, insumoId: baseSlug },
    });
    const insumoId = slugTaken ? `${baseSlug}-${Date.now()}` : baseSlug;

    const insumo = await prisma.estoqueInsumo.create({
      data: {
        userId: tenantUserId,
        insumoId,
        nome: nomeFinal,
        unidade: unidade.trim(),
        categoriaId,
        categoriaNome: categoriaNome || categoriaId,
        categoriaIcone: categoriaIcone || '📦',
      },
    });

    return NextResponse.json(insumo, { status: 201 });
  } catch (err) {
    console.error('[POST /api/estoque/insumos]', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
