import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

/**
 * Ao aprovar nota: cria CmvLancamento COMPRA_NFE por item MAPEADO.
 * nfeItemId @unique impede duplicar.
 */
export async function gerarLancamentosAprovacao(params: {
  userId: string;
  notaId: string;
  storeSlug: string;
  competencia: string;
  dataEntrada: Date;
}): Promise<number> {
  const itens = await prisma.nfeItem.findMany({
    where: { notaId: params.notaId, status: 'MAPEADO' },
  });

  let created = 0;
  for (const item of itens) {
    if (
      !item.estoqueInsumoId ||
      item.quantidadeConvertida == null ||
      item.valorLiquido == null ||
      !item.unidadeConvertida
    ) {
      continue;
    }

    try {
      await prisma.cmvLancamento.create({
        data: {
          userId: params.userId,
          storeSlug: params.storeSlug,
          competencia: params.competencia,
          data: params.dataEntrada,
          tipo: 'COMPRA_NFE',
          estoqueInsumoId: item.estoqueInsumoId,
          quantidade: item.quantidadeConvertida,
          unidade: item.unidadeConvertida,
          valorTotal: item.valorLiquido,
          nfeItemId: item.id,
        },
      });
      created++;
    } catch (err) {
      // Unique violation = já existe (idempotente)
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        continue;
      }
      throw err;
    }
  }
  return created;
}

/** Reabre nota: apaga lançamentos. Só se fechamento do mês estiver ABERTO (ou inexistente). */
export async function reabrirNotaSePermitido(params: {
  userId: string;
  notaId: string;
  storeSlug: string;
  competencia: string;
}): Promise<{ ok: boolean; motivo?: string }> {
  const fechamento = await prisma.cmvFechamento.findUnique({
    where: {
      userId_storeSlug_competencia: {
        userId: params.userId,
        storeSlug: params.storeSlug,
        competencia: params.competencia,
      },
    },
  });

  if (fechamento?.status === 'FECHADO') {
    return { ok: false, motivo: 'Competência fechada — não é possível reabrir a nota.' };
  }

  await prisma.cmvLancamento.deleteMany({
    where: {
      userId: params.userId,
      nfeItem: { notaId: params.notaId },
    },
  });

  return { ok: true };
}
