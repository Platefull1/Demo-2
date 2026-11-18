import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireRhPermission, type RhContext } from '@/lib/rh-auth';
import { P } from '@/lib/rh-permissions';
import {
  buildSnapshotFromFuncionario,
  defaultDataDesligamentoYmd,
  patchDataToPrisma,
  serializeRescisao,
  snapshotNeedsRefresh,
  ymdToDate,
} from '@/lib/rh/rescisao';
import {
  rescisaoPatchSchema,
  zodErrorMessage,
} from '@/lib/rh/rescisao-validation';

export const dynamic = 'force-dynamic';

const FUNC_INCLUDE = {
  cargo: { select: { id: true, nome: true } },
  loja: { select: { id: true, nome: true } },
} as const;

function canEdit(ctx: RhContext) {
  return ctx.isAdmin || ctx.hasPermission(P.EMPLOYEES_EDIT);
}

function canFinalize(ctx: RhContext) {
  return ctx.isAdmin || ctx.hasPermission(P.EMPLOYEES_DEACTIVATE);
}

function canAccessPage(ctx: RhContext) {
  return canEdit(ctx) || canFinalize(ctx);
}

function permissionsPayload(ctx: RhContext) {
  return {
    canEdit: canEdit(ctx),
    canFinalize: canFinalize(ctx),
  };
}

async function loadFuncionario(funcionarioId: string, tenantUserId: string) {
  return prisma.rhFuncionario.findFirst({
    where: { id: funcionarioId, userId: tenantUserId },
    include: FUNC_INCLUDE,
  });
}

/**
 * GET — rascunho ou última finalizada (sem gravar refresh de snapshot).
 * Sem rescisão: { rescisao: null, snapshotDesatualizado: false, ... }.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: funcionarioId } = await params;
    const { ctx, error } = await requireRhPermission();
    if (error) return error;
    if (!canAccessPage(ctx!)) {
      return NextResponse.json({ error: 'Sem permissão para esta ação' }, { status: 403 });
    }

    const funcionario = await loadFuncionario(funcionarioId, ctx!.userId);
    if (!funcionario) {
      return NextResponse.json({ error: 'Funcionário não encontrado' }, { status: 404 });
    }

    const rascunho = await prisma.rhRescisao.findFirst({
      where: { funcionarioId, status: 'RASCUNHO' },
    });

    if (rascunho) {
      return NextResponse.json({
        rescisao: serializeRescisao(rascunho),
        snapshotDesatualizado: snapshotNeedsRefresh(rascunho, funcionario),
        funcionario,
        permissions: permissionsPayload(ctx!),
      });
    }

    const finalizada = await prisma.rhRescisao.findFirst({
      where: { funcionarioId, status: 'FINALIZADA' },
      orderBy: { finalizadoEm: 'desc' },
    });

    return NextResponse.json({
      rescisao: finalizada ? serializeRescisao(finalizada) : null,
      snapshotDesatualizado: false,
      funcionario,
      permissions: permissionsPayload(ctx!),
    });
  } catch (err) {
    console.error('[GET /api/rh/funcionarios/[id]/rescisao]', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

/** POST — cria rascunho com snapshot do cadastro e data de desligamento = hoje (SP). */
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: funcionarioId } = await params;
    const { ctx, error } = await requireRhPermission(P.EMPLOYEES_EDIT);
    if (error) return error;

    const funcionario = await loadFuncionario(funcionarioId, ctx!.userId);
    if (!funcionario) {
      return NextResponse.json({ error: 'Funcionário não encontrado' }, { status: 404 });
    }
    if (!funcionario.ativo) {
      return NextResponse.json(
        { error: 'Só é possível iniciar demissão de funcionário ativo' },
        { status: 400 },
      );
    }

    const existente = await prisma.rhRescisao.findFirst({
      where: { funcionarioId, status: 'RASCUNHO' },
    });
    if (existente) {
      return NextResponse.json(
        {
          error: 'Já existe um rascunho de rescisão para este funcionário',
          rescisao: serializeRescisao(existente),
          funcionario,
          permissions: permissionsPayload(ctx!),
        },
        { status: 409 },
      );
    }

    const snapshot = buildSnapshotFromFuncionario(funcionario);
    try {
      const created = await prisma.rhRescisao.create({
        data: {
          funcionarioId,
          status: 'RASCUNHO',
          ...snapshot,
          dataDesligamento: ymdToDate(defaultDataDesligamentoYmd()),
          vencimentos: [],
          descontos: [],
          criadoPorId: ctx!.stackUserId,
        },
      });

      return NextResponse.json(
        {
          rescisao: serializeRescisao(created),
          funcionario,
          permissions: permissionsPayload(ctx!),
        },
        { status: 201 },
      );
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        const again = await prisma.rhRescisao.findFirst({
          where: { funcionarioId, status: 'RASCUNHO' },
        });
        return NextResponse.json(
          {
            error: 'Já existe um rascunho de rescisão para este funcionário',
            rescisao: again ? serializeRescisao(again) : null,
            funcionario,
            permissions: permissionsPayload(ctx!),
          },
          { status: 409 },
        );
      }
      throw e;
    }
  } catch (err) {
    console.error('[POST /api/rh/funcionarios/[id]/rescisao]', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

/** PATCH — atualiza rascunho (sem validar obrigatórios). */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: funcionarioId } = await params;
    const { ctx, error } = await requireRhPermission(P.EMPLOYEES_EDIT);
    if (error) return error;

    const funcionario = await loadFuncionario(funcionarioId, ctx!.userId);
    if (!funcionario) {
      return NextResponse.json({ error: 'Funcionário não encontrado' }, { status: 404 });
    }

    const rascunho = await prisma.rhRescisao.findFirst({
      where: { funcionarioId, status: 'RASCUNHO' },
    });
    if (!rascunho) {
      const finalizada = await prisma.rhRescisao.findFirst({
        where: { funcionarioId, status: 'FINALIZADA' },
        select: { id: true },
      });
      if (finalizada) {
        return NextResponse.json(
          { error: 'Rescisão já finalizada ou excluída' },
          { status: 409 },
        );
      }
      return NextResponse.json({ error: 'Rascunho de rescisão não encontrado' }, { status: 404 });
    }

    const raw = await req.json();
    const parsed = rescisaoPatchSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ error: zodErrorMessage(parsed.error) }, { status: 400 });
    }

    const updated = await prisma.rhRescisao.update({
      where: { id: rascunho.id },
      data: {
        ...patchDataToPrisma(parsed.data),
        // Refresh de snapshot só em RASCUNHO (cadastro pode ter sido corrigido)
        ...buildSnapshotFromFuncionario(funcionario),
      },
    });

    return NextResponse.json({
      rescisao: serializeRescisao(updated),
      snapshotDesatualizado: false,
      funcionario,
      permissions: permissionsPayload(ctx!),
    });
  } catch (err) {
    console.error('[PATCH /api/rh/funcionarios/[id]/rescisao]', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

/** DELETE — exclui rascunho. */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: funcionarioId } = await params;
    const { ctx, error } = await requireRhPermission(P.EMPLOYEES_EDIT);
    if (error) return error;

    const funcionario = await loadFuncionario(funcionarioId, ctx!.userId);
    if (!funcionario) {
      return NextResponse.json({ error: 'Funcionário não encontrado' }, { status: 404 });
    }

    const rascunho = await prisma.rhRescisao.findFirst({
      where: { funcionarioId, status: 'RASCUNHO' },
    });
    if (!rascunho) {
      return NextResponse.json({ error: 'Rascunho de rescisão não encontrado' }, { status: 404 });
    }

    await prisma.rhRescisao.delete({ where: { id: rascunho.id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[DELETE /api/rh/funcionarios/[id]/rescisao]', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
