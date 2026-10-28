export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { prisma } from '@/lib/prisma';
import { requireOcorrenciasContext } from '@/lib/ocorrencias-auth';
import {
  uploadOcorrenciaFoto,
  deleteOcorrenciaFoto,
  createOcorrenciaFotoSignedUrls,
} from '@/lib/ocorrencias-storage';
import { isLojaEscritorio } from '@/lib/ocorrencias-lojas';
import {
  currentMonthBoundsSP,
  spDayStart,
  spDayEnd,
  saoPauloYmd,
} from '@/lib/ocorrencias-period';
import { CanalOcorrencia, CategoriaOcorrencia, Prisma } from '@prisma/client';
import { resolverCategorias, TODAS_CATEGORIAS } from '@/lib/ocorrencias-categorias';

const MAX_FOTO_BYTES = 8 * 1024 * 1024;
const ACCEPTED_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/heic',
]);

const bodySchema = z
  .object({
    lojaId: z.string().min(1, 'Loja obrigatória'),
    numeroPedidoSaipos: z.string().min(1, 'Número do pedido Saipos obrigatório'),
    numeroPedidoExterno: z.string().optional(),
    canalExterno: z.enum(['IFOOD', 'DELIVERY_DIRETO']).optional(),
    descricao: z.string().optional().default(''),
    motoboyId: z.string().optional(),
    categorias: z.array(z.string()).default([]),
  })
  .superRefine((data, ctx) => {
    const result = resolverCategorias(data.categorias, data.descricao);
    if (result.ok === false) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: result.error,
        path: data.categorias.length === 0 ? ['descricao'] : ['categorias'],
      });
    }
  });

function parseCategorias(raw: FormDataEntryValue | null): string[] {
  if (!raw || typeof raw !== 'string') return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }
}

function ymdFromIsoOrDate(value: string | null): string | null {
  if (!value) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  const { year, month, day } = saoPauloYmd(d);
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

// ── POST /api/ocorrencias ─────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const { ctx, error } = await requireOcorrenciasContext('REGISTRAR');
  if (error) return error;

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: 'Requisição inválida (multipart esperado)' },
      { status: 400 },
    );
  }

  const foto = formData.get('foto') as File | null;
  if (!foto) {
    return NextResponse.json({ error: 'Foto obrigatória' }, { status: 400 });
  }

  if (!ACCEPTED_TYPES.has(foto.type)) {
    return NextResponse.json(
      { error: 'Tipo de arquivo não suportado. Use JPEG, PNG, WEBP ou HEIC.' },
      { status: 400 },
    );
  }

  const fotoBuffer = Buffer.from(await foto.arrayBuffer());
  if (fotoBuffer.length > MAX_FOTO_BYTES) {
    return NextResponse.json(
      { error: 'Foto muito grande. Máximo: 8 MB.' },
      { status: 400 },
    );
  }

  const campos = {
    lojaId: formData.get('lojaId'),
    numeroPedidoSaipos: formData.get('numeroPedidoSaipos'),
    numeroPedidoExterno: formData.get('numeroPedidoExterno') || undefined,
    canalExterno: formData.get('canalExterno') || undefined,
    descricao: (formData.get('descricao') as string | null) || '',
    motoboyId: formData.get('motoboyId') || undefined,
    categorias: parseCategorias(formData.get('categorias')),
  };

  const parsed = bodySchema.safeParse(campos);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Dados inválidos', detalhes: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const {
    lojaId,
    numeroPedidoSaipos,
    numeroPedidoExterno,
    canalExterno,
    descricao,
    motoboyId,
    categorias: categoriasEnviadas,
  } = parsed.data;

  const cats = resolverCategorias(categoriasEnviadas, descricao);
  if (cats.ok === false) {
    return NextResponse.json({ error: cats.error }, { status: 400 });
  }

  if (numeroPedidoExterno && !canalExterno) {
    return NextResponse.json(
      { error: 'Canal externo obrigatório quando há número de pedido externo' },
      { status: 400 },
    );
  }

  const loja = await prisma.rhLoja.findFirst({
    where: { id: lojaId, userId: ctx.userId, ativo: true },
  });
  if (!loja || isLojaEscritorio(loja.nome)) {
    return NextResponse.json({ error: 'Loja inválida' }, { status: 400 });
  }

  if (motoboyId) {
    const motoboy = await prisma.deliveryRider.findFirst({
      where: {
        id: motoboyId,
        userId: ctx.userId,
        lojaId,
        status: 'active',
      },
    });
    if (!motoboy) {
      return NextResponse.json(
        { error: 'Motoboy inválido para esta loja' },
        { status: 400 },
      );
    }
  }

  const ocorrenciaId = randomUUID();
  const { year, month } = saoPauloYmd();
  const mesPasta = `${year}-${String(month).padStart(2, '0')}`;
  const fotoPath = `${ctx.userId}/${mesPasta}/${ocorrenciaId}.jpg`;

  try {
    await uploadOcorrenciaFoto(fotoPath, fotoBuffer, foto.type);
  } catch (err) {
    console.error('[ocorrencias] upload foto falhou:', err);
    return NextResponse.json(
      { error: 'Erro ao enviar foto. Tente novamente.' },
      { status: 500 },
    );
  }

  try {
    const ocorrencia = await prisma.ocorrencia.create({
      data: {
        id: ocorrenciaId,
        userId: ctx.userId,
        lojaId,
        numeroPedidoSaipos,
        numeroPedidoExterno: numeroPedidoExterno || null,
        canalExterno: (canalExterno as CanalOcorrencia) || null,
        categorias: cats.categorias as CategoriaOcorrencia[],
        descricao: descricao.trim(),
        fotoPath,
        motoboyId: motoboyId || null,
        criadoPorUserId: ctx.stackUserId,
      },
      select: {
        id: true,
        numeroPedidoSaipos: true,
        loja: { select: { nome: true } },
        createdAt: true,
      },
    });

    return NextResponse.json({ ok: true, ocorrencia }, { status: 201 });
  } catch (err) {
    console.error('[ocorrencias] create falhou, removendo foto:', err);
    await deleteOcorrenciaFoto(fotoPath);
    return NextResponse.json(
      { error: 'Erro ao salvar ocorrência. Foto removida. Tente novamente.' },
      { status: 500 },
    );
  }
}

// ── GET /api/ocorrencias ──────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const { ctx, error } = await requireOcorrenciasContext('VER');
  if (error) return error;

  const { searchParams } = new URL(request.url);

  const lojaId = searchParams.get('lojaId') || undefined;
  const motoboyId = searchParams.get('motoboyId') || undefined;
  const busca = searchParams.get('busca') || undefined;
  const categoriasFiltro = (searchParams.get('categorias') || '')
    .split(',')
    .map((s) => s.trim())
    .filter((s): s is CategoriaOcorrencia =>
      (TODAS_CATEGORIAS as readonly string[]).includes(s),
    );
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const pageSize = 25;

  const defaults = currentMonthBoundsSP();
  const inicioYmd = ymdFromIsoOrDate(searchParams.get('inicio'));
  const fimYmd = ymdFromIsoOrDate(searchParams.get('fim'));
  const inicio = inicioYmd ? spDayStart(inicioYmd) : defaults.start;
  const fim = fimYmd ? spDayEnd(fimYmd) : defaults.end;

  const where: Prisma.OcorrenciaWhereInput = {
    userId: ctx.userId,
    createdAt: { gte: inicio, lte: fim },
  };

  if (lojaId) where.lojaId = lojaId;
  if (motoboyId) where.motoboyId = motoboyId;
  if (categoriasFiltro.length > 0) {
    where.categorias = { hasSome: categoriasFiltro };
  }
  if (busca) {
    where.OR = [
      { numeroPedidoSaipos: { contains: busca, mode: 'insensitive' } },
      { numeroPedidoExterno: { contains: busca, mode: 'insensitive' } },
    ];
  }

  const [total, ocorrencias, totalPorLoja, catsRows] = await Promise.all([
    prisma.ocorrencia.count({ where }),
    prisma.ocorrencia.findMany({
      where,
      select: {
        id: true,
        numeroPedidoSaipos: true,
        numeroPedidoExterno: true,
        canalExterno: true,
        categorias: true,
        descricao: true,
        fotoPath: true,
        criadoPorUserId: true,
        createdAt: true,
        loja: { select: { id: true, nome: true } },
        motoboy: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.ocorrencia.groupBy({
      by: ['lojaId'],
      where,
      _count: { id: true },
    }),
    prisma.ocorrencia.findMany({
      where,
      select: { categorias: true },
    }),
  ]);

  const lojaIds = totalPorLoja.map((t) => t.lojaId);
  const criadorIds = [...new Set(ocorrencias.map((o) => o.criadoPorUserId))];

  const [lojasNomes, criadores, fotoUrls] = await Promise.all([
    lojaIds.length > 0
      ? prisma.rhLoja.findMany({
          where: { id: { in: lojaIds }, userId: ctx.userId },
          select: { id: true, nome: true },
        })
      : [],
    criadorIds.length > 0
      ? prisma.stackUser.findMany({
          where: { id: { in: criadorIds } },
          select: { id: true, displayName: true, primaryEmail: true },
        })
      : [],
    createOcorrenciaFotoSignedUrls(ocorrencias.map((o) => o.fotoPath)),
  ]);

  const nomeMap = Object.fromEntries(lojasNomes.map((l) => [l.id, l.nome]));
  const criadorMap = Object.fromEntries(
    criadores.map((c) => [c.id, c.displayName?.trim() || c.primaryEmail || '—']),
  );

  const contadoresPorLoja = totalPorLoja.map((t) => ({
    lojaId: t.lojaId,
    lojaNome: nomeMap[t.lojaId] || t.lojaId,
    total: t._count.id,
  }));

  const porCategoria: Record<string, number> = {};
  for (const row of catsRows) {
    for (const c of row.categorias) {
      porCategoria[c] = (porCategoria[c] ?? 0) + 1;
    }
  }
  const contadoresPorCategoria = Object.entries(porCategoria)
    .map(([categoria, totalCat]) => ({ categoria, total: totalCat }))
    .sort((a, b) => b.total - a.total);

  return NextResponse.json({
    ocorrencias: ocorrencias.map(({ fotoPath, ...oc }) => ({
      ...oc,
      criadoPorNome: criadorMap[oc.criadoPorUserId] || '—',
      fotoUrl: fotoUrls[fotoPath] || null,
    })),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
    contadoresPorLoja,
    contadoresPorCategoria,
  });
}
