import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { storeSlugFromCnpj } from './lojas';

/**
 * Ao aprovar nota: cria CmvLancamento por item MAPEADO.
 * - Nota normal → COMPRA_NFE
 * - saiposTransferenciaId → TRANSFERENCIA_ENTRADA (origem via CNPJ quando possível)
 * nfeItemId @unique impede duplicar.
 */
export async function gerarLancamentosAprovacao(params: {
  userId: string;
  notaId: string;
  storeSlug: string;
  competencia: string;
  dataEntrada: Date;
}): Promise<number> {
  const nota = await prisma.nfeNota.findFirst({
    where: { id: params.notaId, userId: params.userId },
    include: {
      fornecedor: { select: { cnpj: true, razaoSocial: true, nomeFantasia: true } },
      itens: { where: { status: 'MAPEADO' } },
    },
  });
  if (!nota) return 0;

  const isTransfer =
    nota.saiposTransferenciaId != null && nota.saiposTransferenciaId > 0;

  let lojaOrigem: string | null = null;
  if (isTransfer) {
    lojaOrigem =
      storeSlugFromCnpj(nota.fornecedor.cnpj) ||
      inferirLojaPorNome(
        nota.fornecedor.nomeFantasia || nota.fornecedor.razaoSocial,
      );
  }

  let created = 0;
  for (const item of nota.itens) {
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
          tipo: isTransfer ? 'TRANSFERENCIA_ENTRADA' : 'COMPRA_NFE',
          estoqueInsumoId: item.estoqueInsumoId,
          quantidade: item.quantidadeConvertida,
          unidade: item.unidadeConvertida,
          valorTotal: item.valorLiquido,
          nfeItemId: item.id,
          lojaOrigem: isTransfer ? lojaOrigem : null,
          observacao: isTransfer
            ? `NF-e transferência Saipos #${nota.saiposTransferenciaId}`
            : null,
        },
      });
      created++;
    } catch (err) {
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

function inferirLojaPorNome(nome: string | null | undefined): string | null {
  const n = String(nome || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
  if (n.includes('ahu')) return 'ahu';
  if (n.includes('pilar')) return 'pilarzinho';
  if (n.includes('porta')) return 'portao';
  if (n.includes('uber')) return 'uberaba';
  return null;
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
