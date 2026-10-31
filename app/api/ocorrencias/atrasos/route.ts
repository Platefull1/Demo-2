export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireOcorrenciasContext } from '@/lib/ocorrencias-auth';
import { isLojaEscritorio } from '@/lib/ocorrencias-lojas';
import { displayLojaAta } from '@/lib/ocorrencias-ata-data';
import {
  atrasosPutSchema,
  atrasosQuerySchema,
} from '@/lib/ocorrencias-ata-validation';

export async function GET(request: NextRequest) {
  const { ctx, error } = await requireOcorrenciasContext('VER');
  if (error) return error;

  const parsed = atrasosQuerySchema.safeParse({
    ano: request.nextUrl.searchParams.get('ano'),
    mes: request.nextUrl.searchParams.get('mes'),
  });
  if (!parsed.success) {
    return NextResponse.json({ error: 'ano e mes inválidos' }, { status: 400 });
  }

  const { ano, mes } = parsed.data;
  const [lojasRaw, rows] = await Promise.all([
    prisma.rhLoja.findMany({
      where: { userId: ctx.userId, ativo: true },
      select: { id: true, nome: true },
      orderBy: { nome: 'asc' },
    }),
    prisma.ocorrenciaAtrasoMensal.findMany({
      where: { companyId: ctx.userId, ano, mes },
      select: { lojaId: true, quantidade: true, updatedAt: true, atualizadoPorId: true },
    }),
  ]);

  const lojas = lojasRaw.filter((l) => !isLojaEscritorio(l.nome));
  const byLoja = new Map(rows.map((r) => [r.lojaId, r]));

  return NextResponse.json({
    ano,
    mes,
    itens: lojas.map((l) => {
      const row = byLoja.get(l.id);
      return {
        lojaId: l.id,
        lojaNome: displayLojaAta(l.nome),
        quantidade: row?.quantidade ?? null,
        informado: Boolean(row),
      };
    }),
  });
}

export async function PUT(request: NextRequest) {
  const { ctx, error } = await requireOcorrenciasContext('VER');
  if (error) return error;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }

  const parsed = atrasosPutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
  }

  const { ano, mes, itens } = parsed.data;
  const lojas = await prisma.rhLoja.findMany({
    where: {
      userId: ctx.userId,
      ativo: true,
      id: { in: itens.map((i) => i.lojaId) },
    },
    select: { id: true, nome: true },
  });
  const validIds = new Set(
    lojas.filter((l) => !isLojaEscritorio(l.nome)).map((l) => l.id),
  );
  if (itens.some((i) => !validIds.has(i.lojaId))) {
    return NextResponse.json({ error: 'Loja inválida' }, { status: 400 });
  }

  await prisma.$transaction(
    itens.map((item) =>
      prisma.ocorrenciaAtrasoMensal.upsert({
        where: {
          companyId_lojaId_ano_mes: {
            companyId: ctx.userId,
            lojaId: item.lojaId,
            ano,
            mes,
          },
        },
        create: {
          companyId: ctx.userId,
          lojaId: item.lojaId,
          ano,
          mes,
          quantidade: item.quantidade,
          atualizadoPorId: ctx.stackUserId,
        },
        update: {
          quantidade: item.quantidade,
          atualizadoPorId: ctx.stackUserId,
        },
      }),
    ),
  );

  return NextResponse.json({ ok: true, ano, mes });
}
