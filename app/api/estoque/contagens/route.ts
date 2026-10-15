import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getEstoqueTenantContext } from '@/lib/estoque-tenant';
import { canAccessLojaNome, filterByLojaAccess } from '@/lib/store-access';
import type { StockSession } from '../../../estoque/types';

export const dynamic = 'force-dynamic';

function toSession(c: {
  id: string;
  dataCriacao: Date;
  status: string;
  sessoes: unknown;
  criadoPor: string;
  lojaNome: string | null;
}): StockSession {
  return {
    id: c.id,
    dataCriacao: c.dataCriacao.toISOString(),
    status: c.status as 'em_andamento' | 'concluida',
    sessoes: c.sessoes as unknown as StockSession['sessoes'],
    criadoPor: c.criadoPor,
    lojaNome: c.lojaNome,
  };
}

// ── GET: listar contagens do tenant no escopo de loja ─────────────────────────
export async function GET() {
  try {
    const ctx = await getEstoqueTenantContext();
    if (!ctx) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    if (ctx.store.lojaNaoConfigurada) {
      return NextResponse.json([]);
    }

    const contagens = await prisma.estoqueContagem.findMany({
      where: { userId: { in: ctx.userIds } },
      orderBy: { dataCriacao: 'desc' },
    });

    const sessions = filterByLojaAccess(contagens, ctx.store).map(toSession);
    return NextResponse.json(sessions);
  } catch (error) {
    console.error('❌ Estoque GET error:', error);
    return NextResponse.json({ error: 'Erro ao carregar contagens' }, { status: 500 });
  }
}

// ── POST: criar nova contagem ─────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const ctx = await getEstoqueTenantContext();
    if (!ctx) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    if (ctx.store.lojaNaoConfigurada) {
      return NextResponse.json(
        {
          error:
            'Loja não configurada. Peça ao administrador para definir a loja deste usuário.',
          code: 'LOJA_NAO_CONFIGURADA',
        },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { sessoes, criadoPor = 'Gerente', lojaNome } = body;
    const lojaNomeNorm =
      typeof lojaNome === 'string' && lojaNome.trim() ? lojaNome.trim() : null;

    if (!Array.isArray(sessoes)) {
      return NextResponse.json({ error: 'Payload inválido' }, { status: 400 });
    }

    // Toda contagem nova exige loja (qualquer perfil). Contagens antigas sem
    // loja continuam listáveis só para escopo total via canAccessLojaNome.
    if (!lojaNomeNorm) {
      return NextResponse.json(
        {
          error: 'Selecione uma loja para iniciar a contagem',
          code: 'LOJA_OBRIGATORIA',
        },
        { status: 403 },
      );
    }

    if (!canAccessLojaNome(ctx.store, lojaNomeNorm)) {
      return NextResponse.json(
        {
          error: `Sem acesso à loja "${lojaNomeNorm}"`,
          code: 'LOJA_FORBIDDEN',
        },
        { status: 403 },
      );
    }

    const contagem = await prisma.estoqueContagem.create({
      data: {
        userId: ctx.tenantUserId,
        criadoPor,
        lojaNome: lojaNomeNorm,
        sessoes,
        status: 'em_andamento',
      },
    });

    return NextResponse.json(toSession(contagem), { status: 201 });
  } catch (error) {
    console.error('❌ Estoque POST error:', error);
    return NextResponse.json({ error: 'Erro ao criar contagem' }, { status: 500 });
  }
}
