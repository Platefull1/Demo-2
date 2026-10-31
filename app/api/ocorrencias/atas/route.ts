export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireOcorrenciasContext } from '@/lib/ocorrencias-auth';
import { loadAtaSource } from '@/lib/ocorrencias-ata-source';
import {
  ESCOPO_REDE,
  ESCOPO_TODAS_LOJAS,
  displayLojaAta,
  lojaSlugAta,
} from '@/lib/ocorrencias-ata-data';
import { atasMesQuerySchema, atasPostSchema } from '@/lib/ocorrencias-ata-validation';
import {
  generateOcorrenciaAtaLojaDocx,
  generateOcorrenciaAtaRedeDocx,
} from '@/lib/ocorrencias-ata-docx';
import {
  generateOcorrenciaAtaLojaPdf,
  generateOcorrenciaAtaRedePdf,
} from '@/lib/ocorrencias-ata-pdf';
import {
  ataOcorrenciaFilename,
  ataOcorrenciaPath,
  ataOcorrenciaZipPath,
  createAtaOcorrenciaSignedUrl,
  uploadAtaOcorrenciaDocx,
  uploadAtaOcorrenciaPdf,
  uploadAtaOcorrenciaZip,
} from '@/lib/ocorrencias-ata-storage';
import { createZipStore } from '@/lib/ocorrencias-zip';
import {
  ATA_GEN_LIMIT,
  ATA_GEN_WINDOW_MS,
  rateLimitAllow,
} from '@/lib/ocorrencias-rate-limit';

const TTL = 3600;

async function saveAta(opts: {
  companyId: string;
  ano: number;
  mes: number;
  escopo: string;
  filePath: string;
  geradaPorId: string;
}) {
  return prisma.ocorrenciaAta.upsert({
    where: {
      companyId_ano_mes_escopo: {
        companyId: opts.companyId,
        ano: opts.ano,
        mes: opts.mes,
        escopo: opts.escopo,
      },
    },
    create: {
      companyId: opts.companyId,
      ano: opts.ano,
      mes: opts.mes,
      escopo: opts.escopo,
      filePath: opts.filePath,
      geradaPorId: opts.geradaPorId,
      geradaEm: new Date(),
    },
    update: {
      filePath: opts.filePath,
      geradaPorId: opts.geradaPorId,
      geradaEm: new Date(),
    },
  });
}

export async function GET(request: NextRequest) {
  const { ctx, error } = await requireOcorrenciasContext('VER');
  if (error) return error;

  const parsed = atasMesQuerySchema.safeParse({
    ano: request.nextUrl.searchParams.get('ano'),
    mes: request.nextUrl.searchParams.get('mes'),
  });
  if (!parsed.success) {
    return NextResponse.json({ error: 'ano e mes inválidos' }, { status: 400 });
  }

  const { ano, mes } = parsed.data;
  const atas = await prisma.ocorrenciaAta.findMany({
    where: { companyId: ctx.userId, ano, mes },
    orderBy: { geradaEm: 'desc' },
  });

  const geradorIds = [...new Set(atas.map((a) => a.geradaPorId))];
  const lojaIds = atas.filter((a) => a.escopo !== ESCOPO_REDE).map((a) => a.escopo);

  const [geradores, lojas] = await Promise.all([
    geradorIds.length
      ? prisma.stackUser.findMany({
          where: { id: { in: geradorIds } },
          select: { id: true, displayName: true, primaryEmail: true },
        })
      : [],
    lojaIds.length
      ? prisma.rhLoja.findMany({
          where: { id: { in: lojaIds }, userId: ctx.userId },
          select: { id: true, nome: true },
        })
      : [],
  ]);

  const geradorMap = Object.fromEntries(
    geradores.map((g) => [g.id, g.displayName?.trim() || g.primaryEmail || '—']),
  );
  const lojaMap = Object.fromEntries(
    lojas.map((l) => [l.id, displayLojaAta(l.nome)]),
  );

  return NextResponse.json({
    atas: atas.map((a) => ({
      id: a.id,
      ano: a.ano,
      mes: a.mes,
      escopo: a.escopo,
      escopoLabel: a.escopo === ESCOPO_REDE ? 'Rede' : (lojaMap[a.escopo] ?? 'Loja'),
      geradaPorNome: geradorMap[a.geradaPorId] || '—',
      geradaEm: a.geradaEm,
    })),
  });
}

export async function POST(request: NextRequest) {
  const { ctx, error } = await requireOcorrenciasContext('VER');
  if (error) return error;

  if (!rateLimitAllow(`ata:${ctx.stackUserId}`, ATA_GEN_LIMIT, ATA_GEN_WINDOW_MS)) {
    return NextResponse.json({ error: 'Muitas tentativas. Aguarde um minuto.' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }

  const parsed = atasPostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
  }

  const { ano, mes, escopo } = parsed.data;
  const { atual, anterior, empresa } = await loadAtaSource(ctx.userId, ano, mes);

  const temAnterior = anterior.temRegistros;

  async function gerarLoja(lojaId: string) {
    const loja = atual.lojas.find((l) => l.id === lojaId);
    if (!loja) return null;
    const items = atual.items.filter((i) => i.lojaId === loja.id);
    const atraso = atual.atrasos.find((a) => a.lojaId === loja.id)?.quantidade ?? null;
    const prevItems = anterior.items.filter((i) => i.lojaId === loja.id);
    const prevAtraso = anterior.atrasos.find((a) => a.lojaId === loja.id)?.quantidade ?? null;
    const common = {
      empresa,
      ano,
      mes,
      loja,
      items,
      atraso,
      prevItems: temAnterior ? prevItems : null,
      prevAtraso: temAnterior ? prevAtraso : null,
      temDadosAnterior: temAnterior,
    };
    const [pdf, docx] = await Promise.all([
      generateOcorrenciaAtaLojaPdf(common),
      generateOcorrenciaAtaLojaDocx(common),
    ]);
    const slug = lojaSlugAta(loja.nome);
    const filePath = ataOcorrenciaPath(ctx.userId, ano, mes, slug, 'pdf');
    const uploaded = await uploadAtaOcorrenciaPdf(filePath, pdf);
    if ('error' in uploaded) return { error: uploaded.error };
    await uploadAtaOcorrenciaDocx(
      ataOcorrenciaPath(ctx.userId, ano, mes, slug, 'docx'),
      docx,
    );
    const row = await saveAta({
      companyId: ctx.userId,
      ano,
      mes,
      escopo: loja.id,
      filePath,
      geradaPorId: ctx.stackUserId,
    });
    return {
      id: row.id,
      escopo: loja.id,
      filename: ataOcorrenciaFilename(slug, ano, mes, 'pdf'),
      bytes: pdf,
    };
  }

  if (escopo === ESCOPO_REDE) {
    const commonRede = {
      empresa,
      ano,
      mes,
      lojas: atual.lojas,
      items: atual.items,
      atrasos: atual.atrasos,
      prevItems: temAnterior ? anterior.items : null,
      prevAtrasos: temAnterior ? anterior.atrasos : null,
      temDadosAnterior: temAnterior,
    };
    const [pdf, docx] = await Promise.all([
      generateOcorrenciaAtaRedePdf(commonRede),
      generateOcorrenciaAtaRedeDocx(commonRede),
    ]);
    const filePath = ataOcorrenciaPath(ctx.userId, ano, mes, 'rede', 'pdf');
    const uploaded = await uploadAtaOcorrenciaPdf(filePath, pdf);
    if ('error' in uploaded) {
      return NextResponse.json({ error: uploaded.error }, { status: 502 });
    }
    await uploadAtaOcorrenciaDocx(
      ataOcorrenciaPath(ctx.userId, ano, mes, 'rede', 'docx'),
      docx,
    );
    const row = await saveAta({
      companyId: ctx.userId,
      ano,
      mes,
      escopo: ESCOPO_REDE,
      filePath,
      geradaPorId: ctx.stackUserId,
    });
    const previewUrl = await createAtaOcorrenciaSignedUrl(filePath, TTL);
    return NextResponse.json({
      ok: true,
      ids: [row.id],
      atas: [{ id: row.id, escopo: ESCOPO_REDE }],
      previewUrl,
      filename: ataOcorrenciaFilename('rede', ano, mes, 'pdf'),
    });
  }

  if (escopo === ESCOPO_TODAS_LOJAS) {
    const geradas: { id: string; escopo: string; filename: string; bytes: Buffer }[] = [];
    for (const loja of atual.lojas) {
      const r = await gerarLoja(loja.id);
      if (!r) continue;
      if ('error' in r) {
        return NextResponse.json({ error: r.error }, { status: 502 });
      }
      geradas.push(r);
    }

    let zipUrl: string | null = null;
    let zipFilename: string | null = null;
    if (geradas.length > 0) {
      const zip = createZipStore(
        geradas.map((g) => ({ name: g.filename, data: g.bytes })),
      );
      const zipPath = ataOcorrenciaZipPath(ctx.userId, ano, mes);
      const zipUp = await uploadAtaOcorrenciaZip(zipPath, zip);
      if (!('error' in zipUp)) {
        zipUrl = await createAtaOcorrenciaSignedUrl(zipPath, TTL);
        zipFilename = `atas-ocorrencias-${ano}-${String(mes).padStart(2, '0')}.zip`;
      }
    }

    return NextResponse.json({
      ok: true,
      ids: geradas.map((g) => g.id),
      atas: geradas.map((g) => ({ id: g.id, escopo: g.escopo })),
      zipUrl,
      zipFilename,
    });
  }

  const lojaOk = atual.lojas.some((l) => l.id === escopo);
  if (!lojaOk) {
    return NextResponse.json({ error: 'Loja inválida' }, { status: 400 });
  }
  const r = await gerarLoja(escopo);
  if (!r) {
    return NextResponse.json({ error: 'Loja inválida' }, { status: 400 });
  }
  if ('error' in r) {
    return NextResponse.json({ error: r.error }, { status: 502 });
  }
  const previewUrl = await createAtaOcorrenciaSignedUrl(
    ataOcorrenciaPath(ctx.userId, ano, mes, lojaSlugAta(
      atual.lojas.find((l) => l.id === escopo)?.nome ?? 'loja',
    ), 'pdf'),
    TTL,
  );
  return NextResponse.json({
    ok: true,
    ids: [r.id],
    atas: [{ id: r.id, escopo }],
    previewUrl,
    filename: r.filename,
  });
}
