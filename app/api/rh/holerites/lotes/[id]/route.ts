import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRhPermission } from '@/lib/rh-auth';
import { P } from '@/lib/rh-permissions';
import { limparDraftsDoLote } from '@/lib/holerites/process-batch';
import { removePayslipObjects } from '@/lib/holerites/storage';
import { temContatoValido } from '@/lib/holerites/publish';
import type {
  IgnoredPage,
  PayslipSourceFile,
  UnmatchedPage,
} from '@/lib/holerites/types-ingest';
import { SystemTool } from '@/types/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

async function requireViewOrUpload() {
  const { ctx, error } = await requireRhPermission(undefined, SystemTool.HOLERITES);
  if (error) return { ctx: null, error };
  if (!ctx.hasPermission(P.PAYSLIPS_VIEW) && !ctx.hasPermission(P.PAYSLIPS_UPLOAD)) {
    return {
      ctx: null,
      error: NextResponse.json({ error: 'Sem permissão para esta ação' }, { status: 403 }),
    };
  }
  return { ctx, error: null };
}

/**
 * GET /api/rh/holerites/lotes/[id]
 */
export async function GET(_req: NextRequest, { params }: Ctx) {
  const { ctx, error } = await requireViewOrUpload();
  if (error || !ctx) return error!;

  const { id: batchId } = await params;

  const batch = await prisma.payslipBatch.findFirst({
    where: { id: batchId, userId: ctx.userId },
    select: {
      id: true,
      competencia: true,
      type: true,
      status: true,
      errorMessage: true,
      sourceFiles: true,
      unmatchedPages: true,
      ignoredPages: true,
      notifyStatus: true,
    },
  });
  if (!batch) {
    return NextResponse.json({ error: 'Lote não encontrado' }, { status: 404 });
  }

  const isPublished = batch.status === 'PUBLISHED';
  const payslipStatusFilter = isPublished
    ? (['PUBLISHED', 'VIEWED', 'ACKNOWLEDGED'] as const)
    : (['DRAFT'] as const);

  const noventaDiasAtras = new Date();
  noventaDiasAtras.setUTCDate(noventaDiasAtras.getUTCDate() - 90);

  const [payslips, ativos, funcionariosOpcoes] = await Promise.all([
    prisma.payslip.findMany({
      where: {
        batchId,
        userId: ctx.userId,
        status: { in: [...payslipStatusFilter] },
      },
      select: {
        id: true,
        pageCount: true,
        netAmountCents: true,
        funcionarioId: true,
        sourcePath: true,
        sourcePageIndexes: true,
        replacesId: true,
        funcionario: {
          select: {
            id: true,
            nome: true,
            telefone: true,
            whatsappLid: true,
            loja: { select: { id: true, nome: true } },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.rhFuncionario.findMany({
      where: { userId: ctx.userId, ativo: true },
      select: {
        id: true,
        nome: true,
        loja: { select: { id: true, nome: true } },
      },
      orderBy: { nome: 'asc' },
    }),
    prisma.rhFuncionario.findMany({
      where: {
        userId: ctx.userId,
        OR: [
          { ativo: true },
          { dataDemissao: { gte: noventaDiasAtras } },
        ],
      },
      select: {
        id: true,
        nome: true,
        ativo: true,
        loja: { select: { id: true, nome: true } },
      },
      orderBy: { nome: 'asc' },
      take: 500,
    }),
  ]);

  const funcionarioIds = payslips.map((d) => d.funcionarioId);
  const publicadosAnteriores =
    isPublished || funcionarioIds.length === 0
      ? []
      : await prisma.payslip.findMany({
          where: {
            userId: ctx.userId,
            competencia: batch.competencia,
            type: batch.type,
            funcionarioId: { in: funcionarioIds },
            status: { in: ['PUBLISHED', 'VIEWED', 'ACKNOWLEDGED'] },
          },
          select: { funcionarioId: true },
        });
  const retificacaoSet = new Set(publicadosAnteriores.map((p) => p.funcionarioId));

  const draftFuncSet = new Set(payslips.map((d) => d.funcionarioId));

  const ativosComHoleriteAtivo =
    ativos.length === 0
      ? []
      : await prisma.payslip.findMany({
          where: {
            userId: ctx.userId,
            competencia: batch.competencia,
            type: batch.type,
            funcionarioId: { in: ativos.map((a) => a.id) },
            status: { in: ['DRAFT', 'PUBLISHED', 'VIEWED', 'ACKNOWLEDGED'] },
          },
          select: { funcionarioId: true },
        });
  const comHolerite = new Set(ativosComHoleriteAtivo.map((p) => p.funcionarioId));

  const ativosSemHolerite = ativos
    .filter((a) => !draftFuncSet.has(a.id) && !comHolerite.has(a.id))
    .map((a) => ({
      id: a.id,
      nome: a.nome,
      loja: a.loja ? { id: a.loja.id, nome: a.loja.nome } : null,
    }));

  const sourceFiles = ((batch.sourceFiles ?? []) as PayslipSourceFile[]).map((f) => ({
    name: f.name,
    sizeBytes: f.sizeBytes,
  }));

  const unmatchedPages = (batch.unmatchedPages ?? []) as UnmatchedPage[];
  const ignoredPages = (batch.ignoredPages ?? []) as IgnoredPage[];

  const draftsOut = payslips
    .map((d) => {
      const semContato = !temContatoValido(d.funcionario);
      return {
        id: d.id,
        funcionario: {
          id: d.funcionario.id,
          nome: d.funcionario.nome,
          loja: d.funcionario.loja
            ? { id: d.funcionario.loja.id, nome: d.funcionario.loja.nome }
            : null,
        },
        pageCount: d.pageCount,
        netAmountCents: d.netAmountCents,
        retificacao: isPublished
          ? Boolean(d.replacesId)
          : retificacaoSet.has(d.funcionarioId),
        semContato,
        sourcePath: d.sourcePath,
        sourcePageIndexes: d.sourcePageIndexes ?? [],
      };
    })
    .sort((a, b) => {
      const lojaA = a.funcionario.loja?.nome ?? '';
      const lojaB = b.funcionario.loja?.nome ?? '';
      if (lojaA !== lojaB) return lojaA.localeCompare(lojaB, 'pt-BR');
      return a.funcionario.nome.localeCompare(b.funcionario.nome, 'pt-BR');
    });

  const retificacoes = draftsOut.filter((d) => d.retificacao).length;
  const semWhatsapp = draftsOut.filter((d) => d.semContato).length;

  return NextResponse.json({
    lote: {
      id: batch.id,
      competencia: batch.competencia,
      type: batch.type,
      status: batch.status,
      errorMessage: batch.errorMessage,
      notifyStatus: batch.notifyStatus,
      sourceFiles,
    },
    drafts: draftsOut,
    unmatchedPages,
    ignoredPages,
    ativosSemHolerite,
    funcionariosOpcoes: funcionariosOpcoes.map((f) => ({
      id: f.id,
      nome: f.nome,
      ativo: f.ativo,
      loja: f.loja ? { id: f.loja.id, nome: f.loja.nome } : null,
    })),
    permissoes: {
      canUpload: ctx.hasPermission(P.PAYSLIPS_UPLOAD),
      canPublish: ctx.hasPermission(P.PAYSLIPS_PUBLISH),
    },
    resumo: {
      vinculados: draftsOut.length,
      semVinculo: unmatchedPages.length,
      ativosSemHolerite: ativosSemHolerite.length,
      retificacoes,
      semWhatsapp,
    },
  });
}

/**
 * DELETE /api/rh/holerites/lotes/[id]
 */
export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const { ctx, error } = await requireRhPermission(
    P.PAYSLIPS_UPLOAD,
    SystemTool.HOLERITES,
  );
  if (error) return error;

  const { id: batchId } = await params;

  const batch = await prisma.payslipBatch.findFirst({
    where: { id: batchId, userId: ctx.userId },
    select: { id: true, status: true, sourceFiles: true },
  });
  if (!batch) {
    return NextResponse.json({ error: 'Lote não encontrado' }, { status: 404 });
  }
  if (batch.status === 'PUBLISHED') {
    return NextResponse.json(
      { error: 'Lote publicado não pode ser cancelado' },
      { status: 409 },
    );
  }

  await limparDraftsDoLote(batchId, ctx.userId);

  const stagingPaths = ((batch.sourceFiles ?? []) as PayslipSourceFile[]).map(
    (f) => f.path,
  );
  await removePayslipObjects(stagingPaths).catch((err) => {
    console.error('[holerites/lotes DELETE] staging', err);
  });

  await prisma.payslipBatch.update({
    where: { id: batchId },
    data: {
      status: 'CANCELLED',
      unmatchedPages: [],
      ignoredPages: [],
      errorMessage: null,
    },
  });

  return NextResponse.json({ ok: true });
}
