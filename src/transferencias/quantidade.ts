import { prisma } from '@/lib/prisma';

/**
 * Converte quantidade informada para a unidade do CMV Real
 * (CmvRealInsumoConfig.KG|UN), usando EstoqueProdutoConfig.kgPorUnidade
 * quando o CMV espera KG e a contagem/entrada veio em unidade.
 */
export async function converterQuantidadeParaCmv(params: {
  tenantUserId: string;
  estoqueInsumoId: string;
  quantidade: number;
  /** Unidade em que `quantidade` foi informada (ex.: pelo parser WhatsApp). */
  unidadeInformada?: 'KG' | 'UN' | null;
}): Promise<{ quantidade: number; unidade: 'KG' | 'UN' }> {
  if (!(params.quantidade > 0)) {
    throw new Error('Quantidade deve ser maior que zero');
  }

  const [cfg, insumo] = await Promise.all([
    prisma.cmvRealInsumoConfig.findFirst({
      where: {
        userId: params.tenantUserId,
        estoqueInsumoId: params.estoqueInsumoId,
        ativo: true,
      },
      select: { unidade: true },
    }),
    prisma.estoqueInsumo.findFirst({
      where: { id: params.estoqueInsumoId, userId: params.tenantUserId },
      select: { insumoId: true },
    }),
  ]);

  if (!cfg) throw new Error('Produto CMV não encontrado no catálogo');
  if (!insumo) throw new Error('Insumo não encontrado');

  const unidadeCmv = cfg.unidade as 'KG' | 'UN';
  const informada = params.unidadeInformada ?? unidadeCmv;

  if (unidadeCmv === 'KG' && informada === 'UN') {
    const prodCfg = await prisma.estoqueProdutoConfig.findUnique({
      where: {
        userId_produtoId: {
          userId: params.tenantUserId,
          produtoId: insumo.insumoId,
        },
      },
      select: { kgPorUnidade: true },
    });
    if (prodCfg?.kgPorUnidade && prodCfg.kgPorUnidade > 0) {
      return {
        quantidade: params.quantidade * prodCfg.kgPorUnidade,
        unidade: 'KG',
      };
    }
  }

  return { quantidade: params.quantidade, unidade: unidadeCmv };
}
