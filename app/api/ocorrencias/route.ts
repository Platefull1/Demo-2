export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { prisma } from '@/lib/prisma';
import { requireOcorrenciasContext } from '@/lib/ocorrencias-auth';
import {
  uploadOcorrenciaFoto,
  deleteOcorrenciaFotos,
  createOcorrenciaFotoSignedUrls,
} from '@/lib/ocorrencias-storage';
import { isLojaEscritorio } from '@/lib/ocorrencias-lojas';
import { displayLojaAta } from '@/lib/ocorrencias-ata-data';
import {
  currentMonthBoundsSP,
  monthsOverlappingRange,
  spDayStart,
  spDayEnd,
  saoPauloYmd,
} from '@/lib/ocorrencias-period';
import { CanalOcorrencia, CategoriaOcorrencia, Prisma } from '@prisma/client';
import { resolverCategorias, TODAS_CATEGORIAS } from '@/lib/ocorrencias-categorias';
import {
  ocorrenciaBodySchema,
  parseCategorias,
  parsePage,
  parsePageSize,
  clampBusca,
} from '@/lib/ocorrencias-validation';
import {
  MAX_FOTO_BYTES,
  MAX_OCORRENCIA_FOTOS,
  MAX_MULTIPART_BYTES,
  fotoPathFor,
  ocorrenciaFotoPaths,
  processarFotoOcorrencia,
} from '@/lib/ocorrencias-foto';
import {
  rateLimitAllow,
  POST_OCORRENCIA_LIMIT,
  POST_OCORRENCIA_WINDOW_MS,
} from '@/lib/ocorrencias-rate-limit';

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

  if (!rateLimitAllow(`post:${ctx.stackUserId}`, POST_OCORRENCIA_LIMIT, POST_OCORRENCIA_WINDOW_MS)) {
    return NextResponse.json({ error: 'Muitas tentativas. Aguarde um minuto.' }, { status: 429 });
  }

  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > MAX_MULTIPART_BYTES) {
    return NextResponse.json(
      { error: `Arquivo(s) muito grande(s). Máximo: 8 MB por foto, até ${MAX_OCORRENCIA_FOTOS} fotos.` },
      { status: 413 },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: 'Requisição inválida (multipart esperado)' },
      { status: 400 },
    );
  }

  const fotosRaw = [
    ...formData.getAll('fotos'),
    ...formData.getAll('foto'),
  ].filter((f): f is File => f instanceof File && f.size > 0);

  if (fotosRaw.length > MAX_OCORRENCIA_FOTOS) {
    return NextResponse.json(
      { error: `Máximo de ${MAX_OCORRENCIA_FOTOS} fotos por ocorrência.` },
      { status: 400 },
    );
  }

  const jpegBuffers: Buffer[] = [];
  for (const foto of fotosRaw) {
    if (foto.size > MAX_FOTO_BYTES) {
      return NextResponse.json(
        { error: 'Foto muito grande. Máximo: 8 MB por arquivo.' },
        { status: 413 },
      );
    }
    const rawBuf = Buffer.from(await foto.arrayBuffer());
    const processed = await processarFotoOcorrencia(rawBuf);
    if (processed.ok === false) {
      return NextResponse.json({ error: processed.error }, { status: 400 });
    }
    jpegBuffers.push(processed.jpeg);
  }

  const campos = {
    lojaId: formData.get('lojaId'),
    numeroPedidoSaipos: formData.get('numeroPedidoSaipos'),
    numeroPedidoExterno: formData.get('numeroPedidoExterno') || undefined,
    canalExterno: formData.get('canalExterno') || undefined,
    descricao: (formData.get('descricao') as string | null) || '',
    motoboyId: formData.get('motoboyId') || undefined,
    categorias: parseCategorias(formData.get('categorias')),
    idempotencyKey: (formData.get('idempotencyKey') as string | null) || undefined,
  };

  const parsed = ocorrenciaBodySchema.safeParse(campos);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Dados inválidos' },
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
    idempotencyKey,
  } = parsed.data;

  const cats = resolverCategorias(categoriasEnviadas, descricao);
  if (cats.ok === false) {
    return NextResponse.json({ error: cats.error }, { status: 400 });
  }
  if (cats.categorias.includes('PEDIDO_ATRASADO')) {
    return NextResponse.json(
      { error: 'Pedido atrasado não é registrado por ocorrência' },
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
  const fotoPaths = jpegBuffers.map((_, i) =>
    fotoPathFor(ctx.userId, ocorrenciaId, mesPasta, i),
  );
  const fotoPath = fotoPaths[0] ?? null;

  if (jpegBuffers.length > 0) {
    try {
      for (let i = 0; i < jpegBuffers.length; i++) {
        await uploadOcorrenciaFoto(fotoPaths[i], jpegBuffers[i], 'image/jpeg');
      }
    } catch {
      console.error('[ocorrencias] upload foto falhou', { ocorrenciaId });
      await deleteOcorrenciaFotos(fotoPaths);
      return NextResponse.json(
        { error: 'Erro ao enviar foto. Tente novamente.' },
        { status: 500 },
      );
    }
  }

  try {
    const ocorrencia = await prisma.ocorrencia.create({
      data: {
        id: ocorrenciaId,
        userId: ctx.userId,
        lojaId,
        numeroPedidoSaipos,
        numeroPedidoExterno: numeroPedidoExterno || null,
        canalExterno: numeroPedidoExterno
          ? ((canalExterno as CanalOcorrencia) || null)
          : null,
        categorias: cats.categorias as CategoriaOcorrencia[],
        descricao: descricao.trim(),
        fotoPath,
        fotoPaths,
        motoboyId: motoboyId || null,
        criadoPorUserId: ctx.stackUserId,
        ...(idempotencyKey ? { idempotencyKey } : {}),
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
    if (
      idempotencyKey &&
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === 'P2002'
    ) {
      const existing = await prisma.ocorrencia.findFirst({
        where: { userId: ctx.userId, idempotencyKey },
        select: {
          id: true,
          numeroPedidoSaipos: true,
          loja: { select: { nome: true } },
          createdAt: true,
        },
      });
      if (existing) {
        if (fotoPaths.length > 0) {
          const removed = await deleteOcorrenciaFotos(fotoPaths);
          if (!removed) {
            console.error('[ocorrencias] foto órfã não removida', { ocorrenciaId });
          }
        }
        return NextResponse.json({ ok: true, ocorrencia: existing, replay: true }, { status: 200 });
      }
    }

    console.error('[ocorrencias] create falhou', { ocorrenciaId });
    if (fotoPaths.length > 0) {
      const removed = await deleteOcorrenciaFotos(fotoPaths);
      if (!removed) {
        console.error('[ocorrencias] foto órfã não removida', { ocorrenciaId });
      }
    }
    return NextResponse.json(
      { error: 'Erro ao salvar ocorrência. Tente novamente.' },
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
  const busca = clampBusca(searchParams.get('busca') || undefined);
  const categoriasFiltro = (searchParams.get('categorias') || '')
    .split(',')
    .map((s) => s.trim())
    .filter((s): s is CategoriaOcorrencia =>
      (TODAS_CATEGORIAS as readonly string[]).includes(s),
    );
  const page = parsePage(searchParams.get('page'));
  const pageSize = parsePageSize(searchParams.get('pageSize'));

  const defaults = currentMonthBoundsSP();
  const inicioYmd = ymdFromIsoOrDate(searchParams.get('inicio'));
  const fimYmd = ymdFromIsoOrDate(searchParams.get('fim'));
  const inicio = inicioYmd ? spDayStart(inicioYmd) : defaults.start;
  const fim = fimYmd ? spDayEnd(fimYmd) : defaults.end;

  const soDestaques = searchParams.get('destaqueAta') === 'true';

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

  const listWhere: Prisma.OcorrenciaWhereInput = soDestaques
    ? { ...where, destaqueAta: true }
    : where;

  const mesesAtraso = monthsOverlappingRange(inicio, fim);
  const atrasoWhere: Prisma.OcorrenciaAtrasoMensalWhereInput = {
    companyId: ctx.userId,
    OR: mesesAtraso.map((m) => ({ ano: m.ano, mes: m.mes })),
  };
  if (lojaId) atrasoWhere.lojaId = lojaId;

  const [total, ocorrencias, totalPorLoja, catsRows, atrasosRows, lojasAtivas] =
    await Promise.all([
    prisma.ocorrencia.count({ where: listWhere }),
    prisma.ocorrencia.findMany({
      where: listWhere,
      select: {
        id: true,
        numeroPedidoSaipos: true,
        numeroPedidoExterno: true,
        canalExterno: true,
        categorias: true,
        descricao: true,
        fotoPath: true,
        fotoPaths: true,
        destaqueAta: true,
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
    mesesAtraso.length > 0
      ? prisma.ocorrenciaAtrasoMensal.findMany({
          where: atrasoWhere,
          select: { lojaId: true, quantidade: true, ano: true, mes: true },
        })
      : Promise.resolve([]),
    prisma.rhLoja.findMany({
      where: { userId: ctx.userId, ativo: true },
      select: { id: true, nome: true },
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
    createOcorrenciaFotoSignedUrls(
      ocorrencias.flatMap((o) => ocorrenciaFotoPaths(o.fotoPath, o.fotoPaths)),
    ),
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
      if (c === 'PEDIDO_ATRASADO') continue;
      porCategoria[c] = (porCategoria[c] ?? 0) + 1;
    }
  }

  const lojasOperacionais = lojasAtivas.filter((l) => !isLojaEscritorio(l.nome));
  const lojasAtrasoAlvo = lojaId
    ? lojasOperacionais.filter((l) => l.id === lojaId)
    : lojasOperacionais;
  const atrasoPorLoja = new Map<string, number>();
  for (const row of atrasosRows) {
    atrasoPorLoja.set(row.lojaId, (atrasoPorLoja.get(row.lojaId) ?? 0) + row.quantidade);
  }
  const lojasSemAtraso = lojasAtrasoAlvo
    .filter((l) => !atrasoPorLoja.has(l.id))
    .map((l) => displayLojaAta(l.nome));
  const atrasosTotal = lojasAtrasoAlvo.reduce(
    (n, l) => n + (atrasoPorLoja.get(l.id) ?? 0),
    0,
  );
  porCategoria.PEDIDO_ATRASADO = atrasosTotal;

  const contadoresPorCategoria = Object.entries(porCategoria)
    .map(([categoria, totalCat]) => ({ categoria, total: totalCat }))
    .sort((a, b) => b.total - a.total);

  return NextResponse.json({
    ocorrencias: ocorrencias.map(({ fotoPath, fotoPaths, ...oc }) => {
      const urls = ocorrenciaFotoPaths(fotoPath, fotoPaths)
        .map((p) => fotoUrls[p])
        .filter((u): u is string => Boolean(u));
      return {
        ...oc,
        criadoPorNome: criadorMap[oc.criadoPorUserId] || '—',
        temFoto: urls.length > 0 || Boolean(fotoPath) || (fotoPaths?.length ?? 0) > 0,
        fotoUrl: urls[0] || null,
        fotoUrls: urls,
      };
    }),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
    contadoresPorLoja,
    contadoresPorCategoria,
    atrasosManuais: {
      total: atrasosTotal,
      lojasSemNumero: lojasSemAtraso,
    },
  });
}
