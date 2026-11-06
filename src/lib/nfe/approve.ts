import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { etiquetaNatureza, naturezaDoItem } from './bonificacao';
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
            : etiquetaNatureza(
                naturezaDoItem({ cfop: item.cfop, alertas: item.alertas }),
              ),
        },
      });
      created++;
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        await prisma.cmvLancamento.update({
          where: { nfeItemId: item.id },
          data: {
            quantidade: item.quantidadeConvertida,
            unidade: item.unidadeConvertida,
            valorTotal: item.valorLiquido,
            estoqueInsumoId: item.estoqueInsumoId,
          },
        });
        continue;
      }
      throw err;
    }
  }

  const ids = nota.itens
    .map((it) => it.estoqueInsumoId)
    .filter((id): id is string => !!id);
  await recalcularCustosDosProdutos({
    userId: params.userId,
    storeSlug: params.storeSlug,
    competencia: params.competencia,
    estoqueInsumoIds: ids,
  });

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

/**
 * MAPEADO → SUGERIDO (mantém produto/fator) para voltarem à fila de pendentes.
 * Assim o Confirmar desce o item para Resolvidos de novo.
 */
export async function voltarMapeadosParaPendentes(params: {
  userId: string;
  notaId: string;
}): Promise<number> {
  const result = await prisma.nfeItem.updateMany({
    where: {
      notaId: params.notaId,
      status: 'MAPEADO',
      nota: { userId: params.userId },
    },
    data: { status: 'SUGERIDO' },
  });
  return result.count;
}

/**
 * Reabre nota aprovada: apaga lançamentos, volta EM_REVISAO e
 * recoloca itens mapeados em pendentes (SUGERIDO).
 * Só se o fechamento do mês estiver ABERTO (ou inexistente).
 */
export async function reabrirNotaSePermitido(params: {
  userId: string;
  notaId: string;
  storeSlug: string;
  competencia: string;
  /** Quem desfez (gerente/escritório) — gravado em reabertaPorId */
  reabertaPorId?: string | null;
}): Promise<{ ok: boolean; motivo?: string; itensPendentes?: number }> {
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

  const nota = await prisma.nfeNota.findFirst({
    where: { id: params.notaId, userId: params.userId },
    select: { id: true, status: true },
  });
  if (!nota) {
    return { ok: false, motivo: 'Nota não encontrada.' };
  }
  if (nota.status !== 'APROVADA' && nota.status !== 'IGNORADA') {
    return { ok: false, motivo: 'Só é possível reabrir nota aprovada ou ignorada.' };
  }

  const [, , itens] = await prisma.$transaction([
    // Lançamentos: apaga os existentes (APROVADA → tem; IGNORADA → não tem, deleteMany é idempotente)
    prisma.cmvLancamento.deleteMany({
      where: {
        userId: params.userId,
        nfeItem: { notaId: params.notaId },
      },
    }),
    prisma.nfeNota.update({
      where: { id: params.notaId },
      data: {
        status: 'EM_REVISAO',
        aprovadaEm: null,
        aprovadaPorId: null,
        aprovacaoAutomatica: false,
        aprovadaComAlerta: false,
        aprovacaoRegra: null,
        reabertaPorId: params.reabertaPorId ?? null,
        reabertaEm: new Date(),
      },
    }),
    prisma.nfeItem.updateMany({
      where: { notaId: params.notaId, status: { in: ['MAPEADO', 'IGNORADO'] } },
      data: { status: 'SUGERIDO' },
    }),
  ]);

  const itensNota = await prisma.nfeItem.findMany({
    where: { notaId: params.notaId },
    select: { estoqueInsumoId: true },
  });
  await recalcularCustosDosProdutos({
    userId: params.userId,
    storeSlug: params.storeSlug,
    competencia: params.competencia,
    estoqueInsumoIds: itensNota
      .map((it) => it.estoqueInsumoId)
      .filter((id): id is string => !!id),
  });

  return { ok: true, itensPendentes: itens.count };
}

async function recalcularCustosDosProdutos(params: {
  userId: string;
  storeSlug: string;
  competencia: string;
  estoqueInsumoIds: string[];
}): Promise<void> {
  if (params.estoqueInsumoIds.length === 0) return;
  const { preencherCustosPendentesFechamento } = await import('./importar-saldo');
  const [saldos, nomes] = await Promise.all([
    prisma.cmvSaldoEstoque.findMany({
      where: {
        userId: params.userId,
        storeSlug: params.storeSlug,
        competencia: params.competencia,
        estoqueInsumoId: { in: params.estoqueInsumoIds },
      },
    }),
    prisma.estoqueInsumo.findMany({
      where: { id: { in: params.estoqueInsumoIds } },
      select: { id: true, nome: true },
    }),
  ]);
  const nomePorId = new Map(nomes.map((n) => [n.id, n.nome]));
  await preencherCustosPendentesFechamento({
    tenantUserId: params.userId,
    storeSlug: params.storeSlug,
    competenciaSaldo: params.competencia,
    recalcularExistentes: true,
    itens: saldos.map((s) => ({
      estoqueInsumoId: s.estoqueInsumoId,
      nome: nomePorId.get(s.estoqueInsumoId) || s.estoqueInsumoId,
      qtd: Number(s.qtdFinal),
      custoMedio: s.custoMedio != null ? Number(s.custoMedio) : null,
      custoOrigem: s.custoOrigem,
    })),
  });
}
