import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRhPermission, type RhContext } from '@/lib/rh-auth';
import { P } from '@/lib/rh-permissions';
import {
  calcTempoDeCasa,
  serializeRescisao,
  type RescisaoItemValor,
} from '@/lib/rh/rescisao';
import {
  DESCONTOS_RESCISAO,
  VENCIMENTOS_RESCISAO,
} from '@/lib/rh/rescisao-config';
import {
  generateRescisaoPdf,
  rescisaoPdfFilename,
} from '@/lib/rh/rescisao-pdf';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function canAccess(ctx: RhContext) {
  return (
    ctx.isAdmin ||
    ctx.hasPermission(P.EMPLOYEES_EDIT) ||
    ctx.hasPermission(P.EMPLOYEES_DEACTIVATE)
  );
}

function mergeForPdf(
  catalog: typeof VENCIMENTOS_RESCISAO,
  saved: RescisaoItemValor[],
): RescisaoItemValor[] {
  const byChave = new Map(saved.map((i) => [i.chave, i]));
  const fromCatalog = catalog.map((c) => {
    const prev = byChave.get(c.chave);
    return {
      chave: c.chave,
      descricao: c.descricao,
      unidade: c.unidade,
      codigo: c.codigo ?? null,
      valor: prev?.valor ?? null,
    };
  });
  const extras = saved.filter(
    (i) => i.chave.startsWith('extra_') || !catalog.some((c) => c.chave === i.chave),
  );
  return [...fromCatalog, ...extras];
}

/**
 * GET — PDF da rescisão (rascunho ou última finalizada) do funcionário do tenant.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: funcionarioId } = await params;
    const { ctx, error } = await requireRhPermission();
    if (error) return error;
    if (!canAccess(ctx!)) {
      return NextResponse.json({ error: 'Sem permissão para esta ação' }, { status: 403 });
    }

    const funcionario = await prisma.rhFuncionario.findFirst({
      where: { id: funcionarioId, userId: ctx!.userId },
      include: {
        cargo: { select: { nome: true } },
        loja: { select: { nome: true } },
      },
    });
    if (!funcionario) {
      return NextResponse.json({ error: 'Funcionário não encontrado' }, { status: 404 });
    }

    const rascunho = await prisma.rhRescisao.findFirst({
      where: { funcionarioId, status: 'RASCUNHO' },
    });
    const rescisao =
      rascunho ??
      (await prisma.rhRescisao.findFirst({
        where: { funcionarioId, status: 'FINALIZADA' },
        orderBy: { finalizadoEm: 'desc' },
      }));

    if (!rescisao) {
      return NextResponse.json({ error: 'Rescisão não encontrada' }, { status: 404 });
    }

    const dto = serializeRescisao(rescisao);
    const pdf = await generateRescisaoPdf({
      empresa: dto.empresa,
      codigo: dto.codigoSnapshot,
      colaborador: dto.nomeSnapshot,
      dataAdmissao: dto.dataAdmissaoSnapshot,
      salario: dto.salarioSnapshot,
      dataDesligamento: dto.dataDesligamento,
      loja: funcionario.loja?.nome ?? null,
      cargo: funcionario.cargo?.nome ?? null,
      tempoCasa: calcTempoDeCasa(dto.dataAdmissaoSnapshot, dto.dataDesligamento),
      cumpreAviso: dto.cumpreAviso,
      descontaAviso: dto.descontaAviso,
      inicioAviso: dto.inicioAviso,
      terminoAviso: dto.terminoAviso,
      possuiEstabilidade: dto.possuiEstabilidade,
      tipoEstabilidade: dto.tipoEstabilidade,
      foiTransferido: dto.foiTransferido,
      empresaOrigem: dto.empresaOrigem,
      tipoRescisao: dto.tipoRescisao,
      tipoAviso: dto.tipoAviso,
      motivo: dto.motivo,
      vencimentos: mergeForPdf(VENCIMENTOS_RESCISAO, dto.vencimentos),
      descontos: mergeForPdf(DESCONTOS_RESCISAO, dto.descontos),
      isRascunho: rescisao.status === 'RASCUNHO',
    });

    const filename = rescisaoPdfFilename({
      codigoOuId: dto.codigoSnapshot || funcionario.id,
      colaborador: dto.nomeSnapshot,
      dataDesligamentoYmd: dto.dataDesligamento,
    });
    return new NextResponse(new Uint8Array(pdf), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    console.error('[GET /api/rh/funcionarios/[id]/rescisao/pdf]', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
