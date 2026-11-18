import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRhPermission } from '@/lib/rh-auth';
import { P } from '@/lib/rh-permissions';
import {
  buildSnapshotFromFuncionario,
  dateToYmd,
  finalizarBodyToPrisma,
  formatYmdBr,
  serializeRescisao,
  tipoRescisaoLabel,
  ymdToDate,
} from '@/lib/rh/rescisao';
import {
  rescisaoFinalizarSchema,
  zodErrorMessage,
} from '@/lib/rh/rescisao-validation';

export const dynamic = 'force-dynamic';

class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
  }
}

/**
 * POST — valida obrigatórios, finaliza rescisão, desliga funcionário e grava histórico.
 * À prova de corrida: updateMany só em RASCUNHO (count !== 1 → 409).
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: funcionarioId } = await params;
    const { ctx, error } = await requireRhPermission(P.EMPLOYEES_DEACTIVATE);
    if (error) return error;

    const funcionario = await prisma.rhFuncionario.findFirst({
      where: { id: funcionarioId, userId: ctx!.userId },
    });
    if (!funcionario) {
      return NextResponse.json({ error: 'Funcionário não encontrado' }, { status: 404 });
    }
    if (!funcionario.ativo) {
      return NextResponse.json(
        { error: 'Rescisão já finalizada ou funcionário já inativo' },
        { status: 409 },
      );
    }

    const rascunho = await prisma.rhRescisao.findFirst({
      where: { funcionarioId, status: 'RASCUNHO' },
    });
    if (!rascunho) {
      return NextResponse.json(
        { error: 'Rascunho de rescisão não encontrado' },
        { status: 404 },
      );
    }

    const raw = await req.json();
    const parsed = rescisaoFinalizarSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ error: zodErrorMessage(parsed.error) }, { status: 400 });
    }

    const data = parsed.data;
    const snapshot = buildSnapshotFromFuncionario(funcionario);
    const dataAdmissaoYmd = dateToYmd(snapshot.dataAdmissaoSnapshot);
    if (!dataAdmissaoYmd) {
      return NextResponse.json(
        {
          error:
            'Funcionário sem data de admissão no cadastro — corrija o cadastro antes de finalizar',
        },
        { status: 400 },
      );
    }

    const tipoLabel = tipoRescisaoLabel(data.tipoRescisao);
    const dataDemissaoDate = ymdToDate(data.dataDesligamento);
    const agora = new Date();
    const bodyData = finalizarBodyToPrisma(data);

    try {
      const finalizada = await prisma.$transaction(async (tx) => {
        const claimed = await tx.rhRescisao.updateMany({
          where: { id: rascunho.id, status: 'RASCUNHO' },
          data: {
            ...bodyData,
            ...snapshot,
            dataAdmissaoSnapshot: ymdToDate(dataAdmissaoYmd),
            status: 'FINALIZADA',
            finalizadoPorId: ctx!.stackUserId,
            finalizadoEm: agora,
          },
        });

        if (claimed.count !== 1) {
          throw new ConflictError('Rescisão já finalizada ou excluída');
        }

        const desligado = await tx.rhFuncionario.updateMany({
          where: { id: funcionarioId, userId: ctx!.userId, ativo: true },
          data: {
            ativo: false,
            dataDemissao: dataDemissaoDate,
          },
        });

        if (desligado.count !== 1) {
          throw new ConflictError('Rescisão já finalizada ou funcionário já inativo');
        }

        await tx.rhHistoricoFuncionario.create({
          data: {
            userId: ctx!.userId,
            funcionarioId,
            campo: 'rescisao',
            valorAnterior: 'Ativo',
            valorNovo: `FINALIZADA — ${tipoLabel}`,
            alteradoPor: ctx!.stackUserId,
            motivo: data.motivo.trim(),
          },
        });

        await tx.rhHistoricoFuncionario.create({
          data: {
            userId: ctx!.userId,
            funcionarioId,
            campo: 'dataDemissao',
            valorAnterior: '',
            valorNovo: formatYmdBr(data.dataDesligamento),
            alteradoPor: ctx!.stackUserId,
            motivo: data.motivo.trim(),
          },
        });

        await tx.rhHistoricoFuncionario.create({
          data: {
            userId: ctx!.userId,
            funcionarioId,
            campo: 'ativo',
            valorAnterior: 'Ativo',
            valorNovo: 'Inativo',
            alteradoPor: ctx!.stackUserId,
            motivo: data.motivo.trim(),
          },
        });

        const updated = await tx.rhRescisao.findUniqueOrThrow({
          where: { id: rascunho.id },
        });
        return updated;
      });

      return NextResponse.json({
        rescisao: serializeRescisao(finalizada),
        ok: true,
      });
    } catch (e) {
      if (e instanceof ConflictError) {
        return NextResponse.json({ error: e.message }, { status: 409 });
      }
      throw e;
    }
  } catch (err) {
    console.error('[POST /api/rh/funcionarios/[id]/rescisao/finalizar]', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
